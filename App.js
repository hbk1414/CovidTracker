import React, { useEffect, useState } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["worldwide"]);
  const [CountryInfo, setCountryInfo] = useState({});
  const [TableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries") //the link to pull data from
        .then((response) => response.json()) //from the data retrieved we want it in json format
        .then((data) => {
          //specififying what we actually want from the data
          const countries = data.map((country) => ({
            //we only want from the countries there names and value
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "wordlwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  console.log("country info >>>>>", CountryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={CountryInfo.todayCases}
            total={CountryInfo.cases}
          />
          <InfoBox
            title="Recovered Cases"
            cases={CountryInfo.todayRecovered}
            total={CountryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={CountryInfo.todayDeaths}
            total={CountryInfo.deaths}
          />
        </div>

        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By country</h3>
          <Table countries={TableData} />

          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
