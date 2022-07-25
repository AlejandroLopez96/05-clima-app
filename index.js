require('dotenv').config();

const { inquirerMenu, pausa, leerInput, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {
    const busquedas = new Busquedas();
    let opt = '';

    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case 1:
                // mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
                
                // buscar el lugar
                const lugares = await busquedas.ciudad(lugar);

                // seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares);
                if (idSeleccionado === 0) continue;
                const lugarSeleccionado = lugares.find(l => l.id === idSeleccionado);

                // guardar en BD
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                // clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

                // mostrar resutados
                console.log('informacion de la ciudad'.green);
                console.log('Ciudad: ', lugarSeleccionado.nombre.green);
                console.log('Lat: ', lugarSeleccionado.lat);
                console.log('Lng: ', lugarSeleccionado.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Temp.Min: ',clima.min);
                console.log('Temp.Max: ', clima.max);
                console.log('Como esta el clima: ', clima.desc.green);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((l, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${l}`)

                });
                break;
            default:
                break;
        }
        
        if (opt !== 0) await pausa();
    } while (opt !== 0);

}

main();
// console.log(process.env);