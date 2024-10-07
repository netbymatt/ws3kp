// regional forecast

import STATUS from './status.mjs';
import { distance as calcDistance } from './utils/calc.mjs';
import { json } from './utils/fetch.mjs';
import WeatherDisplay from './weatherdisplay.mjs';
import { registerDisplay } from './navigation.mjs';
import { getPoint } from './utils/weather.mjs';
import { locationCleanup, shortenCurrentConditions } from './utils/string.mjs';

class RegionalForecast extends WeatherDisplay {
	constructor(navId, elemId) {
		super(navId, elemId, 'Regional Forecast', true);

		// timings
		this.timing.totalScreens = 1;
	}

	async getData(_weatherParameters) {
		if (!super.getData(_weatherParameters)) return;
		const weatherParameters = _weatherParameters ?? this.weatherParameters;

		// calculate distance to each city
		const regionalCitiesDistances = RegionalCities.map((city) => ({
			...city,
			distance: calcDistance(city.lon, city.lat, weatherParameters.longitude, weatherParameters.latitude),
		}));

		// sort the regional cities by distance
		const regionalCitiesSorted = regionalCitiesDistances.toSorted((a, b) => a.distance - b.distance);

		// get regional forecasts and observations (the two are intertwined due to the design of api.weather.gov)
		const regionalDataAll = await Promise.all(regionalCitiesSorted.slice(0, 9).map(async (city) => {
			try {
				const point = city?.point ?? (await getAndFormatPoint(city.lat, city.lon));
				if (!point) throw new Error('No pre-loaded point');

				const forecast = await json(`https://api.weather.gov/gridpoints/${point.wfo}/${point.x},${point.y}/forecast`);

				// we need a high and low temperature
				// high temperature is the first period with isDaytime = true
				// low temperature is the next adjacent period
				const firstDaytime = forecast.properties.periods.findIndex((period) => period.isDaytime);

				return buildForecast(city, forecast.properties.periods[firstDaytime], forecast.properties.periods[firstDaytime + 1]);
			} catch (error) {
				console.log(`No regional forecast data for '${city.name ?? city.city}'`);
				console.log(error);
				return false;
			}
		}));

		// filter out any false (unavailable data)
		const regionalData = regionalDataAll.filter((data) => data);

		// test for data present
		if (regionalData.length === 0) {
			this.setStatus(STATUS.noData);
			return;
		}

		// return the weather data and offsets
		this.data = regionalData;
		this.setStatus(STATUS.loaded);
	}

	async drawCanvas() {
		super.drawCanvas();
		const conditions = this.data;

		// sort array by station name
		const forecasts = conditions.sort((a, b) => ((a.Name < b.Name) ? -1 : 1));

		const lines = forecasts.slice(0, 7).map((forecast) => {
			const fill = {
				location: locationCleanup(forecast.name).substr(0, 14),
				'temp-low': forecast.low,
				'temp-high': forecast.high,
				weather: shortenCurrentConditions(forecast.weather).substr(0, 9),
			};

			return this.fillTemplate('forecast-row', fill);
		});

		const linesContainer = this.elem.querySelector('.forecast-lines');
		linesContainer.innerHTML = '';
		linesContainer.append(...lines);

		this.finishDraw();
	}
}

const getAndFormatPoint = async (lat, lon) => {
	const point = await getPoint(lat, lon);
	return {
		x: point.properties.gridX,
		y: point.properties.gridY,
		wfo: point.properties.gridId,
	};
};

const buildForecast = (city, high, low) => ({
	high: high?.temperature ?? 0,
	low: low?.temperature ?? 0,
	name: locationCleanup(city.city).substr(0, 14),
	weather: shortenCurrentConditions(high.shortForecast),
});

// register display
registerDisplay(new RegionalForecast(3, 'regional-forecast'));
