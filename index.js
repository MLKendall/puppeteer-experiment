import puppeteer from 'puppeteer';

const parks = ['raccoon_creek_state_park', 'moraine_state_park', 'mcconnells_mill_state_park', 'keystone_state_park', 'jennings_environmental_education_center', 'bald_eagle_state_park', 'black_moshannon_state_park', 'cook_forest_state_park', 'laurel_hill_state_park', 'sinnemahoning_state_park', 'yellow_creek_state_park']

const month = process.argv[2];
const year = process.argv[3];


const Puppet = async () => {
	const browser = await puppeteer.launch({
		headless: 'new'
	});

	const page = await browser.newPage();

	let eventList = [];

	const sortParkEventsByDate = () => {
		eventList.sort(function(a,b){
			return new Date(a.realDateTime) - new Date(b.realDateTime);
		})
	};


	for (let i = 0; i < parks.length; i++) {
		const url = `http://events.dcnr.pa.gov/${parks[i]}/calendar/month/${year}/${month}`;
		await page.goto(url);
		const eventText = await page.$eval('h4', el => el.innerText);
		const parkName = eventText.replace('EVENT CALENDAR FOR', '');
		const textMonth = (await page.$eval('h1', el => el.innerText));

		const parkEvents = await page.$$('.event_item')

		for (let i = 0; i < parkEvents.length; i++) {
			let parkEvent = {} 
				let parkEventNode = await parkEvents[i];
				parkEvent.parkName = parkName.toLowerCase();
				parkEvent.title =  await parkEventNode.$eval('h3 a', el => el.innerText);
				parkEvent.link = await parkEventNode.$eval('h3 a', el => el.href);
				parkEvent.realDateTime = await parkEventNode.$eval('.dtstart', el => el.title);
				parkEvent.eventDateTime = await parkEventNode.$eval('.dtstart', el => el.innerText);
				eventList.push(parkEvent);
		}
	}

	sortParkEventsByDate();

	console.log(eventList);
	await page.close();
	await browser.close();
}

Puppet();