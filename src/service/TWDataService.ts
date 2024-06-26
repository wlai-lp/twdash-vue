import { EventData, LanguageData } from '../types/types';

export class TWDataService {
    workingData: EventData[];
    masterData: EventData[];
    fromTimestamp: number;
    toTimestamp: number;

    setFromTimestamp(fromTimestamp:number){
        // debugger;
        this.fromTimestamp = fromTimestamp
    }

    setToTimestamp(toTimestamp:number){
        this.toTimestamp = toTimestamp
    }

    async getData() {
        try {
            const response = await fetch('/demo/data/tw022024.json', { headers: { 'Cache-Control': 'no-cache' } });
            const data = await response.json();
            return this.makeFlat(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        // return fetch('/demo/data/tw022024.json', { headers: { 'Cache-Control': 'no-cache' } })
        //     .then((res) => res.json())
        //     .then((d) => this.makeFlat(d));
    }

    makeFlat(jsonData) {
        // debugger;
        // const jsonData = JSON.parse(json);
        const eventDataArray: EventData[] = [];
        for (const convoId in jsonData) {
            // console.log(`convoid = ${convoId}`);

            // 1 convo can have many agents worked on the conversation
            for (const agentId in jsonData[convoId]) {
                // console.log('agent id = ' + agentId);
                const languageDataArray = jsonData[convoId][agentId] as LanguageData[];
                // console.log(languageDataArray[0].language);
                const convertedDate = new Date(languageDataArray[0].time).toLocaleDateString('en-US');
                const convertedDateTime = new Date(languageDataArray[0].time).toLocaleString('en-US');
                // console.log("🚀 ~ TWDataService ~ makeFlat ~ convertedDateTime:", convertedDateTime)
                // console.log(`converted date = ${convertedDate}`);

                let event: EventData = {
                    convoId: convoId,
                    agentId: agentId,
                    language: languageDataArray[0].language,
                    timestamp: languageDataArray[0].time,
                    date: convertedDate,
                    dateTime: convertedDateTime
                };

                eventDataArray.push(event);
            }
            // for (const messageId in jsonData[userId]) {
            //     const languageDataArray = jsonData[userId][messageId] as LanguageData[];
            //     languageDataArray.forEach(languageData => {
            //         dataArray.push({
            //             userId,
            //             messageId,
            //             languageData
            //         });
            //     });
            // }
        }

        console.log(eventDataArray.length);
        // cache the data to local storage
        this.workingData = eventDataArray;
        this.masterData = eventDataArray;
        return eventDataArray;
    }

    getUpdatedTo(timestamp : number) {
        this.toTimestamp = timestamp
        this.workingData = this.masterData.filter(e => e.timestamp >= this.fromTimestamp && e.timestamp <= this.toTimestamp)
        return this.workingData;
    }

    getUpdatedFrom(timestamp : number) {
        this.fromTimestamp = timestamp
        this.workingData = this.masterData.filter(e => e.timestamp >= this.fromTimestamp && e.timestamp <= this.toTimestamp)
        return this.workingData;
    }

    getTotalCount() {
        console.log('🚀 ~ TWDataService ~ getTotalCount ~ getTotalCount');

        return this.workingData.length;
    }

    getTopUsage() {}

    getTopNLanguages(i : number) {
        const languageCounts = {};

        // Count occurrences of each language
        this.workingData.forEach((item) => {
            const language = item.language;
            if (!languageCounts[language]) {
                languageCounts[language] = 0;
            }
            languageCounts[language]++;
        });

        // Convert object to array of [language, count] pairs and sort by count in descending order
        const sortedLanguageCounts = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);

        // Return top 5 counts
        return sortedLanguageCounts.slice(0, i);
    }

    getTop4LanPieData(){
        interface returnData {
            data: number[];
            labels: string[];
        }

        const top4 = this.getTopNLanguages(4);
        let top4Result : returnData = {data: [], labels: []}
        for(let i = 0; i < top4.length; i++ ){
            top4Result.data.push(Object.entries(top4[i])[1][1])
            top4Result.labels.push(Object.entries(top4[i])[0][1])
        }
        // const result : returnData = {data: }
        return top4Result;
        
        
    }

}
