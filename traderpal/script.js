// Función que registra el plugin y lo usa con los enlaces de #result a
        function setupDisonclickPlugin() {

        (function($) {
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
                  margin: -10px 0 0 -10px;
                  border: 3px solid white;
                  border-top: 3px solid gray;
                  border-radius: 50%;
                  animation: disonclick-spin 1s linear infinite;
                }
                @keyframes disonclick-spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `;
              document.head.appendChild(style);
            }
          }
        
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
                  if ($el.hasClass('disonclick-loading')) {
                    e.preventDefault();
                    return;
                  }
        
                  $el.addClass('disonclick-loading').attr('aria-disabled', true);
                  actionOrCommand.call(this, e, $el);
                });
              });
            }
            return this;
          };
        })(jQuery);
        
          console.log('.sendtoemail está visible. Registrando plugin y configurando descargas...');
        
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
        
                // Nombre del archivo personalizado
                a.download = 'T29-QQL3TJM1.pdf'; // Aquí especificas el nombre deseado
        
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
        
                console.log('Descarga completada.');
                $link.disonclick('off');
              })
              .catch(error => {
                console.error('Error durante la descarga:', error);
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
