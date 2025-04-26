// Función para inyectar estilos CSS
            function injectDisonclickStyles() {
                if (!document.getElementById('disonclick-styles')) {
                  var style = document.createElement('style');
                  style.id = 'disonclick-styles';
                  style.innerHTML = `
                    .disonclick-loading {
          background-color: #ccc !important;
          color: transparent !important;
          position: relative;
          pointer-events: none;
          text-decoration: none;
          cursor: wait !important;
        }
        .disonclick-loading::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -30px; /* Ajustado para dejar espacio al texto */
          border: 3px solid white;
          border-top: 3px solid gray;
          border-radius: 50%;
          animation: disonclick-spin 1s linear infinite;
        }
        .disonclick-loading .loading-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(10px, -50%);
          margin-left: 25px; /* Espacio entre el spinner y el texto */
          color: gray;
          font-size: 12px;
          white-space: nowrap;
        }
        @keyframes disonclick-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        a[data-disabled="true"] {
          pointer-events: none; /* Deshabilitar clics */
          color: #000; /* Cambiar el color del texto */
          text-decoration: none; /* Quitar subrayado */
          cursor: default; /* Cambiar el cursor */
        }
                  `;
                  document.head.appendChild(style);
                }
              }
          
          // Función que registra el plugin y lo usa con los enlaces de #result a
          function setupDisonclickPlugin() {
            console.log('.sendtoemail está visible. Registrando plugin y configurando descargas...');


            injectDisonclickStyles(); // Insertar estilos si no están
            
              // Plugin jQuery disonclick
              $.fn.disonclick = function(actionOrCommand) {
                injectDisonclickStyles(); // Insertar estilos si no están
            
                if (actionOrCommand === 'off') {
                  this.each(function() {
                    var $el = $(this);
                    $el.removeClass('disonclick-loading').attr('aria-disabled', false);
                  });
                } else if (typeof actionOrCommand === 'function') {
                  this.each(function() {
                    var $el = $(this);
            
                    $el.off('click.disonclick').on('click.disonclick', function(e) {
                      if ($el.hasClass('disonclick-loading') || $el.attr('data-disabled') === 'true') {
                        e.preventDefault();
                        return;
                      }
            
                      // Agregar la clase de carga y bloquear el enlace
                      $el.addClass('disonclick-loading').attr('aria-disabled', true);
            
                      // Mostrar el texto "Iniciando descarga..."
                      $el.append('<span class="loading-text">Iniciando descarga...</span>');
            
                      // Ejecutar la función personalizada
                      actionOrCommand.call(this, e, $el);
                    });
                  });
                }
                return this;
              };

          

                // Uso del plugin para descargar archivos
                $('#result a').disonclick(function(e, $link) {
                e.preventDefault();
                var href = $link.attr('href');
            
                console.log('Iniciando descarga...');
            
                fetch(href)
                    .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al descargar el archivo.');
                    }
                    return response.blob();
                    })
                    .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    const fileName = href.split('/').pop() || 'archivo'; // Extraer nombre del archivo o usar uno predeterminado
                    a.download = fileName + '.pdf';
            
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
            
                    console.log('Descarga completada.');
            
                    // Actualizar el texto del enlace y deshabilitarlo
                    $link.text('Descarga completada').css({
                        color: '#000',
                        cursor: 'default'
                    }).attr('data-disabled', 'true'); // Marcar como deshabilitado
            
                    // Remover el estado de carga
                    $link.disonclick('off');

                    })
                    .catch(error => {
                    console.error('Error durante la descarga:', error);
            
                    // Remover el estado de carga en caso de error
                    $link.disonclick('off');
                    });
                });

          }
          
          // Verificar periódicamente si .sendtoemail está visible
          const checkVisibilityInterval = setInterval(() => {
            if ($('.sendtoemail').is(':visible')) {
              console.log('.sendtoemail está visible. Ejecutando setupDisonclickPlugin...');
              
              // Detener el intervalo
              clearInterval(checkVisibilityInterval);
          
              // Llamar a la función que registra el plugin y lo usa
              setupDisonclickPlugin();
            }
          }, 500); // Verificar cada 500 ms
