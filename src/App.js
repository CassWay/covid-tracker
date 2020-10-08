import React, { useState, useEffect } from "react";
import "./App.css";
import {
	MenuItem,
	FormControl,
	Select,
	Card,
	CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./utility";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
	const [countries, setCountries] = useState([]);
	const [country, setInputCountry] = useState("worldWide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCountries, setMapCountries] = useState([]);
	const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
	const [casesType, setCasesType] = useState("cases");
	const [mapZoom, setMapZoom] = useState(3);

	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));
					let sortedData = sortData(data);
					setTableData(sortedData);
					setMapCountries(data);
					setCountries(countries);
				});
		};
		getCountriesData();
	}, []);

	const onCountryChange = async (e) => {
		const countryCode = e.target.value;

		const url =
			countryCode === "worldWide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setInputCountry(countryCode);
				setCountryInfo(data);
				setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(4);
			});
	};

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1 style={{ color: "#fa8e11", textShadow: "2px 1px #0d0d0d" }}>
						COVID 19 TRACKER
					</h1>
					<FormControl className="app__dropdown">
						<Select
							variant="outlined"
							onChange={onCountryChange}
							value={country}
						>
							<MenuItem value="worldWide">Worldwide</MenuItem>
							{countries.map((country) => (
								<MenuItem value={country.value}>{country.name}</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="app__stats">
					<InfoBox
						isRed
						active={casesType === "cases"}
						onClick={(e) => setCasesType("cases")}
						title="Coronavirus Cases"
						cases={prettyPrintStat(countryInfo.todayCases)}
						total={numeral(countryInfo.cases).format("0.0a")}
					/>

					<InfoBox
						onClick={(e) => setCasesType("recovered")}
						title="Recovered"
						active={casesType === "recovered"}
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						total={numeral(countryInfo.recovered).format("0.0a")}
					/>

					<InfoBox
						onClick={(e) => setCasesType("deaths")}
						title="Deaths"
						isRed
						active={casesType === "deaths"}
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						total={numeral(countryInfo.deaths).format("0.0a")}
					/>
				</div>

				<Map
					casesType={casesType}
					countries={mapCountries}
					center={mapCenter}
					zoom={mapZoom}
				/>
			</div>
			<div className="app__right">
				<Card>
					<CardContent>
						<div className="app__information">
							<h3>Live Cases By Country</h3>
							<Table countries={tableData} />
							<h3 className="app__graphTitle">Worldwide new {casesType} </h3>
							<LineGraph className="app__graph" casesType={casesType} />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default App;
