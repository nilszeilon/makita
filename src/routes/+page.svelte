<script lang="ts">
    import Chart from "svelte-frappe-charts";
    export let data;

    let options = {
        data: {
            labels: [],
            datasets: [],
            yAxisMode: "tick",
            valuesOverPoints: 1,
            height: 500,
        },
    };

    let lastInWeeksOptions = {
        data: {
            labels: [],
            datasets: [],
        },
    };

    // Reactively compute options whenever data changes
    $: if (data && data.data) {
        //let max = // max of all data.data.teams.total_points
        let max = data.data.teams.reduce((acc: any, item: any) => {
            return Math.max(acc, item.total_points);
        }, 100);

        options = {
            data: {
                labels: data.data.teams[0].history.map((item: any) => {
                    return item.event;
                }),
                datasets: data.data.teams.map((item: any) => {
                    return {
                        name: item.name,
                        type: "line",
                        values: item.history.map((item: any) => {
                            return item.total_points;
                        }),
                    };
                }),
                yAxisMode: "tick",
                valuesOverPoints: 1,
                height: 700
            },
        };
        let lastCount = data.data.lastCount;
        let lastCountList = Object.entries(lastCount).sort((a, b) => {
            return b[1] - a[1];
        });

        // plot
        lastInWeeksOptions = {
            data: {
                labels: ["Last position in a GW"],
                datasets: lastCountList.map((item: any) => {
                    return {
                        name: item[0],
                        values: [item[1]],
                    };
                }),
                type: "bar",
                barOptions: {
                    stacked: 0,
                },
            },
        };
    }
</script>

<h1>The Makita International</h1>

<h2>Hur långt efter Wycombe Athletics ligger man?</h2>

<Chart data={options.data} />

<h2>Hur många gånger har Markus kommit sist?</h2>

<Chart data={lastInWeeksOptions.data} type="bar" />
