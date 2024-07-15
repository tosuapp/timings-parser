const fs = require('fs');
const path = require('path');


const graphs = {};

const fileNames = ['cpp', 'rust'];
const files_path = `./`;
const outputs_path = `./`;


function main() {
    try {
        for (let f = 0; f < fileNames.length; f++) {
            const file_name = fileNames[f];
            const file_path = path.join(files_path, `${file_name}.txt`);
            const output_path = path.join(outputs_path, `${file_name}.json`);

            const lines = fs.readFileSync(file_path, 'utf8').split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim() == '') continue;


                const line = lines[i].split(',');
                const name = line[1];

                const time = +line[0] || new Date(+line[0]);
                const savingTime = line[2];


                const graph = graphs[name] || { series: [], xaxis: { type: "datetime", categories: [] } };
                const timings = line[3].split('|');
                for (let t = 0; t < timings.length; t++) {
                    const [key, value] = timings[t].split(':');


                    const find = graph.series.find(r => r.name.toLowerCase() == key.toLowerCase());
                    if (find) {
                        find.data.push(value);
                        continue;
                    };



                    graph.series.push({
                        name: key,
                        data: [value]
                    });
                };


                graph.xaxis.categories.push(time);
                graphs[name] = graph;
            };


            const array = Object.keys(graphs);
            for (let i = 0; i < array.length; i++) {
                const key = array[i];
                const value = graphs[key];

                for (let s = 0; s < value.series.length; s++) {
                    const series = value.series[s];

                    const sum = series.data.reduce((a, value) => parseFloat(a) + +value, 0);
                    if (!value.average) value.average = {};

                    value.average[series.name] = sum / series.data.length;
                };
            };


            fs.writeFileSync(output_path, JSON.stringify(graphs), 'utf8');
        };
    } catch (error) {
        console.log(error);
    };
};

main();