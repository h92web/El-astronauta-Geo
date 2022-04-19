$(document).ready(function(){
    var comenzar = false;

    window.addEventListener("keydown", function(event){
        if (event.code == "Enter" && comenzar == false){
            $("#iniciar").hide();
            comenzar = true;
            startGame();
        }
    });
    
    $("#pantalla_roja").hide();
    $("#pantalla_refrescar").hide();

    var metros_span = document.getElementById('metros_viajados');
    var puntos_sumados_span = document.getElementById('puntos_sumados');
    var caja_juego_ID = document.getElementById("juego");
    var h1_nivel = document.getElementById("texto_nivel");
    var vidas_span = document.getElementById('vidas');

    var colision_juego_izquierda = 0;
    var colision_juego_derecha = $("#juego").css("width").slice(0, -2);
    var colision_juego_arriba = 0;
    var colision_juego_abajo = $("#juego").css("height").slice(0, -2);

    var colision_pantalla_arriba = colision_juego_arriba + parseInt($("header").height()) + 15;
    var colision_pantalla_abajo = colision_juego_abajo - 15;
    var colision_pantalla_izquierda = colision_juego_izquierda + 15;
    var colision_pantalla_derecha = colision_juego_derecha - 15 - parseInt($("#Astronauta_Geo").width());

    var metros_viajados = 0;
    var puntos_sumados = 0;
    var count_disparos = 0;
    var numero_enemigo_nuevo = 0;
    var vidas = 5;

    var geo_personaje;

    var interval_creacion_particulas = 0;
    var intervaloFuncionCrearParticulas;
    var intervaloFuncionMetrosViajados;
    var intervalo_segundos_llamada_enemigo;
    var intervalo_deteccion_disparos;
    var intervalo_deteccion_colision_jugador;

    var space = true;

    var musica;
    var disparo_sonido = document.createElement("audio");
    var explosion_sonido = document.createElement("audio");
    var muerte_sonido = document.createElement("audio");
    var win_sonido;
    var perdiste_sonido;

    disparo_sonido.setAttribute("src", "./audio/disparo.mp3");
    disparo_sonido.setAttribute("id", "disparo_sonido");
    disparo_sonido.setAttribute("controls", "none");
    caja_juego_ID.appendChild(disparo_sonido);
    disparo_sonido.volume = 0.3;

    explosion_sonido.setAttribute("src", "./audio/explosion.mp3");
    explosion_sonido.setAttribute("id", "explosion_sonido");
    explosion_sonido.setAttribute("controls", "none");
    caja_juego_ID.appendChild(explosion_sonido);
    explosion_sonido.volume = 0.3;

    muerte_sonido.setAttribute("src", "./audio/muerte.mp3");
    muerte_sonido.setAttribute("id", "muerte_sonido");
    muerte_sonido.setAttribute("controls", "none");
    caja_juego_ID.appendChild(muerte_sonido);
    muerte_sonido.volume = 0.3;

    function startGame(){
        viajar();
        window.addEventListener("keydown", function(event){
            geo_personaje = new Astronauta_Geo_personaje("Geo");
            if (comenzar == true){
                switch(event.code){
                    case "KeyW": geo_personaje.arriba(); break;
                    case "KeyS": geo_personaje.abajo(); break;
                    case "KeyA": geo_personaje.izquierda(); break;
                    case "KeyD": geo_personaje.derecha(); break;
                    case "Space": 
                        if (space){
                            geo_personaje.disparar(count_disparos);
                            space = false;
                            setTimeout(function(){
                                space = true;
                            }, 1000);
                        }
                        break;
                }
            }
        });

        class Astronauta_Geo_personaje{
            constructor(name){
                this.name = "Geo";
            }

            izquierda(){
                let posicion_actual = parseInt($("#Astronauta_Geo").css("left"));
                let posicion_nueva = parseInt(posicion_actual - 30);
                comprobarPosicion(undefined,undefined,posicion_nueva,undefined);
            }

            derecha(){
                let posicion_actual = parseInt($("#Astronauta_Geo").css("left"));
                let posicion_nueva = parseInt(posicion_actual + 30);
                comprobarPosicion(undefined,undefined,undefined,posicion_nueva);
            }

            arriba(){
                let posicion_actual = parseInt($("#Astronauta_Geo").css("top"));
                let posicion_nueva = parseInt(posicion_actual - 30);
                comprobarPosicion(posicion_nueva,undefined,undefined,undefined);
            }

            abajo(){
                let posicion_actual = parseInt($("#Astronauta_Geo").css("top"));
                let posicion_nueva = parseInt(posicion_actual + 30);
                comprobarPosicion(undefined,posicion_nueva,undefined,undefined);
            }

            disparar(numero_disparo){
                $("#disparo_sonido")[0].play();

                let nuevo_disparo = document.createElement("div");
                nuevo_disparo.setAttribute("class", "disparo disparo" + numero_disparo);
                caja_juego_ID.appendChild(nuevo_disparo);

                let posicion_inicial_disparo_left = parseInt($("#Astronauta_Geo").css("left")) + parseInt($("#Astronauta_Geo").width() / 2) - parseInt($(".disparo" +numero_disparo+ "").width() / 2);
                
                let posicion_inicial_disparo_top = parseInt($("#Astronauta_Geo").css("top")) + parseInt($("#Astronauta_Geo").height() / 2) - parseInt($(".disparo" +numero_disparo+ "").height() / 2);
                $(".disparo" +numero_disparo+ "").css("left", posicion_inicial_disparo_left + "px");
                $(".disparo" +numero_disparo+ "").css("top", posicion_inicial_disparo_top) + "px";

                $(".disparo" +numero_disparo+ "").animate({

                    "left" : parseInt(colision_pantalla_derecha) + 50 + $(".disparo" +numero_disparo+ "").width()

                }, 1000);

                count_disparos++;
            }
        }
        function comprobarPosicion (arriba, abajo, izquierda, derecha){
            if (arriba < colision_pantalla_arriba){
                $("#Astronauta_Geo").css("top", colision_pantalla_arriba + "px");
            }else{
                $("#Astronauta_Geo").animate({
                    "top" : arriba
                }, 50);
            }
            if (abajo > colision_pantalla_abajo){
                $("#Astronauta_Geo").css("top", colision_pantalla_abajo + "px");
            }else{
                $("#Astronauta_Geo").animate({
                    "top" : abajo
                }, 50);
            }
            if (izquierda < colision_pantalla_izquierda){
                $("#Astronauta_Geo").css("left", colision_pantalla_izquierda + "px");
            }else{
                $("#Astronauta_Geo").animate({
                    "left" : izquierda
                }, 50);
            }
            if (derecha > colision_pantalla_derecha){
                $("#Astronauta_Geo").css("left", colision_pantalla_derecha + "px");
            }else{
                $("#Astronauta_Geo").animate({
                    "left" : derecha
                }, 50);
            }
        }

        function viajar(){
            musicaFuncion("on");
            largarParticulas();
            detectarDisparos();
            detectarColisionJugador();
            vidas_span.innerHTML = vidas;

            let posicion_geo_inicial_alto = (colision_pantalla_abajo + 15 + parseInt($("#Astronauta_Geo").width()))/2;

            $("#Astronauta_Geo").css("top", posicion_geo_inicial_alto + "px");
            $("#Astronauta_Geo").css("left", colision_pantalla_izquierda + "px");

            $("#nivel_actual").css("fontSize", "2.3em");
            function animacionTextoNivel(estado){
                if (estado == 1){
                    $("#nivel_actual").animate({
                        "opacity": "1"
                    });
                }else if (estado == 0){
                    $("#nivel_actual").animate({
                        "opacity": "0"
                    });                    
                }
            }

            intervaloFuncionMetrosViajados = setInterval(function(){
                metros_viajados = metros_viajados + 1;
                metros_span.innerHTML = metros_viajados
                switch(metros_viajados){
                    case 100:
                        h1_nivel.innerHTML = "NIVEL 1";
                        animacionTextoNivel(1);
                        setTimeout(function(){
                            animacionTextoNivel(0);
                        }, 3000);
                        llamarEnemigos(2000);
                        break;
                    case 500:
                        clearInterval(intervalo_segundos_llamada_enemigo);
                        h1_nivel.innerHTML = "NIVEL 2";
                        animacionTextoNivel(1);
                        setTimeout(function(){
                            animacionTextoNivel(0);
                        }, 3000);
                        llamarEnemigos(1500);
                        break;
                    case 1000:
                        clearInterval(intervalo_segundos_llamada_enemigo);
                        h1_nivel.innerHTML = "NIVEL 3";
                        animacionTextoNivel(1);
                        setTimeout(function(){
                            animacionTextoNivel(0);
                        }, 3000);
                        llamarEnemigos(1000);
                        break;
                    case 1500:
                        clearInterval(intervalo_segundos_llamada_enemigo);
                        h1_nivel.innerHTML = "NIVEL 4";
                        animacionTextoNivel(1);
                        setTimeout(function(){
                            animacionTextoNivel(0);
                        }, 3000);
                        llamarEnemigos(500);
                        break;
                    case 2000:
                        $("#musica")[0].pause();

                        var win_sonido = document.createElement("audio");
            
                        win_sonido.setAttribute("src", "./audio/win.mp3");
                        win_sonido.setAttribute("id", "win_sonido");
                        win_sonido.setAttribute("controls", "none");
                        caja_juego_ID.appendChild(win_sonido);
                        win_sonido.volume = 0.5;
            
                        $("#win_sonido")[0].play();


                        clearInterval(intervalo_segundos_llamada_enemigo);
                        h1_nivel.innerHTML = "GANASTE!";
                        $("#nivel_actual").animate({
                            "opacity": "1"
                        }, 8000);
                        clearInterval(intervaloFuncionMetrosViajados);
                        clearInterval(intervaloFuncionCrearParticulas);
                        clearInterval(intervalo_deteccion_disparos);
                        clearInterval(intervalo_deteccion_colision_jugador);
                        setTimeout(function(){
                            $("#pantalla_refrescar").show();
                        }, 8000);
                        break;
                }
            }, 50);
        }
        function musicaFuncion(estado){
            if (estado == "on"){
                musica = document.createElement("audio");
                musica.setAttribute("src", "./audio/musica.mp3");
                musica.setAttribute("id", "musica");
                musica.setAttribute("controls", "none");
                caja_juego_ID.appendChild(musica);

                musica.volume = 0.5;
                musica.loop = true;

                $("#musica")[0].play();
            }
        }

        function largarParticulas(){
            let particulas_actuales = $(".particula");

            for (i=0; i < particulas_actuales.length ; i++){
                let particula_actual_i = particulas_actuales[i].getAttribute("class");

                let particula_actual_i_jquery = $("." + particula_actual_i.slice(10));

                if (particula_actual_i_jquery.css("left").slice(0, -2) <= 0){
                    particula_actual_i_jquery.remove();
                }
            }

            let numero_random = Math.floor(Math.random() * 100) + 50;
            let colores_particulas = ["white", "yellow", "skyblue"];
            let color_particula_random = Math.floor(Math.random() * 3);

            intervaloFuncionCrearParticulas = setInterval(function(){
                interval_creacion_particulas++;
                nuevaParticula(colores_particulas[color_particula_random], interval_creacion_particulas);
                clearInterval(intervaloFuncionCrearParticulas);
                largarParticulas();
            }, numero_random);
        }
        function nuevaParticula(color, numero_particula){
            let particula_nueva = document.createElement("div");
            particula_nueva.setAttribute("class", "particula particula" + numero_particula);
            caja_juego_ID.appendChild(particula_nueva);
            
            let particula_nueva_jquery = $(".particula"+ numero_particula + "");
            let random_width = Math.floor(Math.random() * 100) + 1;
            let random_height = Math.floor(Math.random() * 3) + 1;

            particula_nueva_jquery.css("width", random_width + "px");
            particula_nueva_jquery.css("height", random_height + "px");
            particula_nueva_jquery.css("backgroundColor", color);

            let random_inicial_derecha = Math.floor(Math.random() * 1000) + 10;

            let posicion_particula_inicial = parseInt(colision_juego_derecha) + random_inicial_derecha;
            let posicion_particula_final = colision_juego_izquierda - random_width - 1000;

            let altura_header = parseInt($("header").height());
            
            let posicion_particula_alto_min = parseInt(colision_juego_arriba) + altura_header + 10;
            let posicion_particula_alto_max = parseInt(colision_juego_abajo) + altura_header - 10;

            let posicion_particula_random_alto = Math.floor(Math.random() * posicion_particula_alto_max) + posicion_particula_alto_min;

            particula_nueva_jquery.css("position", "absolute");
            particula_nueva_jquery.css("left", posicion_particula_inicial + "px");
            particula_nueva_jquery.css("top", posicion_particula_random_alto + "px");

            let velocidad_random_particula = Math.floor(Math.random() * 3000) + 2000;

            particula_nueva_jquery.animate({"left": posicion_particula_final + "px"}, velocidad_random_particula);
        }

        function detectarDisparos(){
            intervalo_deteccion_disparos = setInterval(function(){

                let disparos_actuales = $(".disparo");

                for (let i=0; i < disparos_actuales.length ; i++){

                    let disparo_actual_i = disparos_actuales[i].getAttribute("class");

                    let disparo_actual_i_jquery = $("." + disparo_actual_i.slice(8));

                    let d_t = parseInt(disparo_actual_i_jquery.css("top").slice(0, -2));
                    let d_r = parseInt(disparo_actual_i_jquery.css("left").slice(0, -2)) + parseInt(disparo_actual_i_jquery.css("width").slice(0, -2));
                    let d_b = parseInt(disparo_actual_i_jquery.css("top").slice(0, -2)) + parseInt(disparo_actual_i_jquery.css("height").slice(0, -2));
                    let d_l = parseInt(disparo_actual_i_jquery.css("left").slice(0, -2));

                    let enemigos_actuales = $(".enemigo");

                    for (i=0; i < enemigos_actuales.length ; i++){
        
                        let enemigo_actual_i = enemigos_actuales[i].getAttribute("class");
        
                        let enemigo_actual_i_jquery = $("." + enemigo_actual_i.slice(8));

                        let e_t = parseInt(enemigo_actual_i_jquery.css("top").slice(0, -2));
                        let e_r = parseInt(enemigo_actual_i_jquery.css("left").slice(0, -2)) + parseInt(enemigo_actual_i_jquery.css("width").slice(0, -2));
                        let e_b = parseInt(enemigo_actual_i_jquery.css("top").slice(0, -2)) + parseInt(enemigo_actual_i_jquery.css("height").slice(0, -2));
                        let e_l = parseInt(enemigo_actual_i_jquery.css("left").slice(0, -2));
        
                        let clase_enemigo = enemigo_actual_i_jquery.attr("class") ;
                        let clase_disparo = disparo_actual_i_jquery.attr("class") ;

                        if (   
                                (
                                    Math.round(d_r) > Math.round(e_l)
                                    &&
                                    Math.round(d_r) < Math.round(e_r)
                                )        
                            ){
                                if (
                                    ( 
                                        Math.round(d_t) > Math.round(e_t)
                                        &&
                                        Math.round(d_t) < Math.round(e_b)
                                    )
                                    ||
                                    ( 
                                        Math.round(d_b) < Math.round(e_b) 
                                        &&
                                        Math.round(d_b) > Math.round(e_t)
                                    )
                                ){
                                    let luz = document.createElement("div");
                                    luz.setAttribute("class", "explosion");
                                    caja_juego_ID.appendChild(luz);
                                    $(".explosion").css("top", d_t + "px");
                                    $(".explosion").css("left", d_l + "px");

                                    $("#explosion_sonido")[0].play();

                                    setTimeout(function(){
                                        enemigo_actual_i_jquery.remove();
                                        disparo_actual_i_jquery.remove();
                                    }, 40);

                                    setTimeout(function(){
                                        $(".explosion").remove();
                                    }, 60);

                                    puntos_sumados = puntos_sumados + 5;
                                    puntos_sumados_span.innerHTML = puntos_sumados;
                                    space = true;
                                }
                        }
                    }
                    if (disparo_actual_i_jquery.css("left").slice(0, -2) > colision_pantalla_derecha){
                        disparo_actual_i_jquery.remove();
                    }
                }
            }, 5);
        }
        function detectarColisionJugador(){
            intervalo_deteccion_colision_jugador = setInterval(function(){

                if (vidas == 0){
                    perdiste();
                    return;
                }

                let geo_personaje = $("#Astronauta_Geo");

                let g_t = parseInt(geo_personaje.css("top").slice(0, -2));
                let g_r = parseInt(geo_personaje.css("left").slice(0, -2)) + parseInt(geo_personaje.css("width").slice(0, -2));
                let g_b = parseInt(geo_personaje.css("top").slice(0, -2)) + parseInt(geo_personaje.css("height").slice(0, -2));
                let g_l = parseInt(geo_personaje.css("left").slice(0, -2));

                let enemigos_actuales = $(".enemigo");

                    for (i=0; i < enemigos_actuales.length ; i++){
        
                        let enemigo_actual_i = enemigos_actuales[i].getAttribute("class");
        
                        let enemigo_actual_i_jquery = $("." + enemigo_actual_i.slice(8));

                        let e_t = parseInt(enemigo_actual_i_jquery.css("top").slice(0, -2));
                        let e_r = parseInt(enemigo_actual_i_jquery.css("left").slice(0, -2)) + parseInt(enemigo_actual_i_jquery.css("width").slice(0, -2));
                        let e_b = parseInt(enemigo_actual_i_jquery.css("top").slice(0, -2)) + parseInt(enemigo_actual_i_jquery.css("height").slice(0, -2));
                        let e_l = parseInt(enemigo_actual_i_jquery.css("left").slice(0, -2));

                        if (   
                                (
                                    Math.round(g_r) > Math.round(e_l)
                                    &&
                                    Math.round(g_r) < Math.round(e_r)
                                )        
                            ){
                                if (
                                    ( 
                                        Math.round(g_t) > Math.round(e_t)
                                        &&
                                        Math.round(g_t) < Math.round(e_b)
                                    )
                                    ||
                                    ( 
                                        Math.round(g_b) < Math.round(e_b) 
                                        &&
                                        Math.round(g_b) > Math.round(e_t)
                                    )
                                ){

                                    $("#pantalla_roja").show();
                                    setTimeout(function(){
                                        $("#pantalla_roja").hide();
                                    }, 100);

                                    $("#muerte_sonido")[0].play();

                                    $("#Astronauta_Geo").remove();
                                    geo_personaje = new Astronauta_Geo_personaje("Geo");
                                    
                                    let geo = document.createElement("div");
                                    geo.setAttribute("id", "Astronauta_Geo");
                                    caja_juego_ID.appendChild(geo);

                                    let posicion_geo_inicial_alto = (colision_pantalla_abajo + 15 + parseInt($("#Astronauta_Geo").width()))/2;

                                    $("#Astronauta_Geo").css("top", posicion_geo_inicial_alto + "px");
                                    $("#Astronauta_Geo").css("left", colision_pantalla_izquierda + "px");
                                                                            
                                    vidas--;
                                    vidas_span.innerHTML = vidas;                                      
                                }
                        }
                    }
            }, 1);
        }

        function llamarEnemigos(segundos){
            numero_enemigo_nuevo = 0;

            intervalo_segundos_llamada_enemigo = setInterval(function(){

                let enemigos_actuales = $(".enemigo");

                for (i=0; i < enemigos_actuales.length ; i++){
                    let enemigo_actual_i = enemigos_actuales[i].getAttribute("class");
    
                    let enemigo_actual_i_jquery = $("." + enemigo_actual_i.slice(8));
    
                    if (enemigo_actual_i_jquery.css("left").slice(0, -2) <= 0){
                        enemigo_actual_i_jquery.remove();
                    }
                }

                numero_enemigo_nuevo++;
                nuevoEnemigo(numero_enemigo_nuevo);
            }, segundos);
        }
        function nuevoEnemigo(numero_enemigo_nuevo){
            let nuevo_enemigo = document.createElement("div");
            nuevo_enemigo.setAttribute("class", "enemigo enemigo" + numero_enemigo_nuevo);

            caja_juego_ID.appendChild(nuevo_enemigo);

            let top_random_enemigo = Math.floor(Math.random() * 500);
            if (top_random_enemigo < colision_pantalla_arriba){

                top_random_enemigo = colision_pantalla_arriba + 30;
            }

            if (top_random_enemigo > colision_pantalla_abajo){

                top_random_enemigo = colision_pantalla_abajo - 30;
            }

            let posicion_inicial_enemigo = colision_pantalla_derecha + 60;

            let enemigo_actual = $(".enemigo" + numero_enemigo_nuevo);

            enemigo_actual.css("top", top_random_enemigo + "px");
            enemigo_actual.css("left", posicion_inicial_enemigo + "px");

            enemigo_actual.animate({
                left : colision_pantalla_izquierda - enemigo_actual.width() - 30
            }, 5000);
        }

        function perdiste(){
            $("#musica")[0].pause();

            var perdiste_sonido = document.createElement("audio");

            perdiste_sonido.setAttribute("src", "./audio/perder.mp3");
            perdiste_sonido.setAttribute("id", "perdiste_sonido");
            perdiste_sonido.setAttribute("controls", "none");
            caja_juego_ID.appendChild(perdiste_sonido);
            perdiste_sonido.volume = 0.5;

            $("#perdiste_sonido")[0].play();

            $("#juego").css("backgroundColor", "rgba(255, 0, 0, 0.6)")
            function animacionTextoNivel(estado){
                if (estado == 1){
                    $("#nivel_actual").animate({
                        "opacity": "1"
                    });
                }else if (estado == 0){
                    $("#nivel_actual").animate({
                        "opacity": "0"
                    });                    
                }
            }
            clearInterval(intervalo_deteccion_colision_jugador);
            clearInterval(intervalo_deteccion_disparos);
            clearInterval(intervalo_segundos_llamada_enemigo);
            clearInterval(intervaloFuncionMetrosViajados);
            clearInterval(intervaloFuncionCrearParticulas);
            h1_nivel.innerHTML = "PERDISTE";
            vidas = 0;
            vidas_span.innerHTML = vidas;
            metros_viajados = 0;
            metros_span.innerHTML = metros_viajados;
            puntos_sumados = 0;
            puntos_sumados_span.innerHTML = puntos_sumados;
            $("#Astronauta_Geo").remove();
            animacionTextoNivel(1);
            setTimeout(function(){
                animacionTextoNivel(0);
            }, 3000);
            setTimeout(function(){
                $("#pantalla_refrescar").show();
            }, 3100);
            

        }
    }
});