export async function load() {
    const res = await fetch('https://fantasy.premierleague.com/api/leagues-classic/526138/standings/');
    const data = await res.json();

    const teams = data.standings.results.map((team: any) => ({
        id: team.entry,
        name: team.player_name,
        rank: team.rank,
        total: team.total
    }));

    for (const team of data.standings.results) {
        const res = await fetch(`https://fantasy.premierleague.com/api/entry/${team.entry}/history/`);
        const data2 = await res.json();

        const history = data2.current.map((week: any) => ({
            event: week.event,
            points: week.points,
            total_points: week.total_points
            //bank: week.bank,
            //total_rank: week.overall_rank
        }));

        const teamIndex = teams.findIndex((t: any) => t.id === team.entry);
        teams[teamIndex].history = history;
    }

    // find out who is last in each week
    const lastInWeek = [];

    const num_played = teams[0].history.length;
    interface TeamWeek {
        id: number;
        name: string;
        rank: number;
        points: number;
    }
    
    for (let i = 1; i <= num_played; i++) {
        const week = teams.map((t: any) => ({
            id: t.id,
            name: t.name as string,
            rank: t.history[i - 1].total_rank,
            points: t.history[i - 1].points
        })) as TeamWeek[];
    
        week.sort((a: TeamWeek, b: TeamWeek) => b.points - a.points);
    
        lastInWeek.push(week[week.length - 1]);
    }
    
    // count how many times each team is last
    const lastCount: { [key: string]: number } = {};

    // just add 0 to all team names in case they don't appear
    for (const team of teams) {
        lastCount[team.name] = 0;
    }
    
    for (const team of lastInWeek) {
        if (!lastCount[team.name]) {
            lastCount[team.name] = 0;
        }
    
        lastCount[team.name]++;
    }
    
    
    return {
        status: 200,
        data: {
            teams,
            lastCount
        }
    };
}
