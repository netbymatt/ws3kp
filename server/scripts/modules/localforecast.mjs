// display text based local forecast

import STATUS from './status.mjs';
import { json } from './utils/fetch.mjs';
import WeatherDisplay from './weatherdisplay.mjs';
import { registerDisplay } from './navigation.mjs';

class LocalForecast extends WeatherDisplay {
	constructor(navId, elemId) {
		super(navId, elemId, 'Local Forecast', true);

		// set timings
		this.timing.baseDelay = 5000;
	}

	async getData(weatherParameters, refresh) {
		if (!super.getData(weatherParameters, refresh)) return;

		// get title
		if (!this.originalTitle) {
			this.originalTitle = this.elem.querySelector('.header .title.single').textContent;
		}

		// get raw data
		const rawData = await this.getRawData(this.weatherParameters);
		// check for data, or if there's old data available
		if (!rawData && !this.data) {
			// fail for no old or new data
			this.setStatus(STATUS.failed);
			return;
		}
		// store the data
		this.data = rawData || this.data;
		// parse raw data
		const conditions = parse(this.data);

		// read each text
		this.screenTexts = conditions.map((condition) => {
			// process the text
			let text = `${condition.DayName.toUpperCase()}...`;
			const conditionText = condition.Text;
			text += conditionText.toUpperCase().replace('...', ' ');

			return text;
		});

		// fill the forecast texts
		const templates = this.screenTexts.map((text) => this.fillTemplate('forecast', { text }));
		const forecastsElem = this.elem.querySelector('.forecasts');
		forecastsElem.innerHTML = '';
		forecastsElem.append(...templates);

		// increase each forecast height to a multiple of container height
		this.pageHeight = forecastsElem.parentNode.offsetHeight;
		templates.forEach((forecast) => {
			const newHeight = Math.ceil(forecast.scrollHeight / this.pageHeight) * this.pageHeight;
			forecast.style.height = `${newHeight}px`;
		});

		// update the title
		this.elem.querySelector('.header .title.single').textContent = `${this.originalTitle} -- Zone ${weatherParameters.zoneId}`;

		this.timing.totalScreens = forecastsElem.scrollHeight / this.pageHeight;
		this.calcNavTiming();
		this.setStatus(STATUS.loaded);
	}

	// get the unformatted data (also used by extended forecast)
	async getRawData(weatherParameters) {
		// request us or si units
		try {
			return await json(weatherParameters.forecast, {
				data: {
					units: 'us',
				},
				retryCount: 3,
				stillWaiting: () => this.stillWaiting(),
			});
		} catch (error) {
			console.error(`GetWeatherForecast failed: ${weatherParameters.forecast}`);
			console.error(error.status, error.responseJSON);
			return false;
		}
	}

	async drawCanvas() {
		super.drawCanvas();

		// update the title
		const titleElem = this.elem.querySelector('.header .title.single');
		if (this.screenIndex === 0 && this.weatherParameters.zoneId) {
			titleElem.textContent = `${this.originalTitle} -- Zone ${this.weatherParameters.zoneId}`;
		} else {
			titleElem.textContent = 'Nat\'l Weather Service Forecast';
		}

		const top = -this.screenIndex * this.pageHeight;
		this.elem.querySelector('.forecasts').style.top = `${top}px`;

		this.finishDraw();
	}
}

// format the forecast
// only use the first 6 lines
const parse = (forecast) => forecast.properties.periods.slice(0, 6).map((text) => ({
	// format day and text
	DayName: text.name.toUpperCase(),
	Text: text.detailedForecast,
}));
// register display
registerDisplay(new LocalForecast(4, 'local-forecast'));
