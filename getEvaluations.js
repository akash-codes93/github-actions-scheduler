let request = require('async-request')

const tokenMapper = {
    "basic": process.env['basic'],
    "courses": process.env['courses'],
}

let setEvaluation = async (data, account) => {

    let uuid = data["data"][0]["rounds"][0]["uuid"]
    const token = tokenMapper[account]
    this.data = {}
    try {
        let response = await request(`https://api.relevel.com/api/v2/exams/evaluation/${uuid}/set-evaluator/`, {
            method: "POST",
            headers: {
                'authority': 'api.relevel.com',
                'accept': 'application/json',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'authorization': `Bearer ${token}`,
                'content-type': 'application/json',
                'origin': 'https://relevel.com',
                'platform': 'desktop_web',
                'referer': 'https://relevel.com/',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
            },
            data: JSON.stringify({})
        })

        console.log(response.data);
        console.log("Evaluator is set: " + account)
    } catch (e) {
        console.log("Error in setEvaluation: ")
    }
}


let checkEvaluationExists = async (account) => {
    const token = tokenMapper[account]
    this.data = {}

    try {
        let response = await request('https://api.relevel.com/api/v2/exams/evaluation/rounds/?is_pending=True', {
            method: "GET",
            headers: {
                'authority': 'api.relevel.com',
                'accept': 'application/json',
                'accept-language': 'en-GB,en;q=0.9',
                'authorization': `Bearer ${token}`,
                'origin': 'https://relevel.com',
                'platform': 'desktop_web',
                'referer': 'https://relevel.com/',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
            }
        })

        if (response.statusCode !== 200) {
            return {
                "status": false,
                "data": this.data
            };
        }

        this.data = JSON.parse(response.body)
        console.log(this.data)

        if (this.data["data"].length === 0) {
            console.log("No task to evaluate: " + account)
            return {
                "status": false,
                "data": this.data
            };
        }
    } catch (e) {
        console.log("Error in checkEvaluationExists function: " + e)
    }

    return {
        "status": true,
        "data": this.data
    };
}


let start = async () => {

    let totalRequest = parseInt(process.env['totalRequest']) || 1

    while (totalRequest) {
        try {
            let evaluationTask = await checkEvaluationExists("basic");
            if (evaluationTask["status"] === true) {
                await setEvaluation(evaluationTask["data"], "basic")
            }
        } catch (e) {
            console.log("Error in start function: " + e)
        }

        totalRequest -= 1
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
        await delay(15000)
    }

}

start().then(r => console.log("Completed!"))
