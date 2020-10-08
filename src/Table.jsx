import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
	return (
		<div className="table">
			{countries.map(({country, cases, countryInfo}) => (
				<tr>
					<td>
						<div className="info-flag">
							<img src={countryInfo.flag} style={{height: "26px", width: "38px"}}  alt="Country Flag"/>
						</div>
					</td>
					<td>{country.country}</td>
					<td>
						<strong>{numeral(cases).format("0,0")}</strong>
					</td>
				</tr>
			))}
		</div>
	)
}

export default Table
