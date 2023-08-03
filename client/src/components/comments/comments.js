export default function getPastTime(time){
    let secondsTrascurred = time.toDate();
    let actualSeconds = new Date();
    
    let seconds = (actualSeconds - secondsTrascurred) / 1000;

    if ( seconds < 60 ) {
        return "justo ahora";
    } else if ( seconds < 120 ) {
        return "Hace un minuto";
    } else if ( seconds < 2700 ) {
        return `hace ${Math.floor(seconds / 60)} minutos`;
    } else if ( seconds < 5400 ) {
        return "Hace una hora";
    } else if ( seconds < 86400 ) {
        return `hace ${Math.floor(seconds / 3600)} horas`;
    }  else if ( seconds < 172800 ) {
        return "Ayer";
    } else if ( seconds < 604800 ) {
        return `hace ${Math.floor(seconds / 86400)} días`;
    }  else if ( seconds < 1209600 ) {
        return "La semana pasada";
    } else {
        let dias = (Math.floor(seconds / 86400)) / 7;
        return `hace ${Math.floor(Math.floor(dias))} semanas`;
    }
}