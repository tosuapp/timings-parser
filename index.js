const fs = require('fs');


const graphs = {};

const fileName = 'timings';
const file_path = `./${fileName}.txt`;
const output_path = `./${fileName}.json`;


function main() {
    try {
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


        fs.writeFileSync(output_path, JSON.stringify(graphs), 'utf8');
    } catch (error) {
        console.log(error);
    };
};

main();