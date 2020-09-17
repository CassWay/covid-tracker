import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, total }) {
	return (
		<Card className="infoBox">
			<CardContent>
				{/* Title i.e Coronavirus cases*/}
				<Typography className="infoBox__title" color="textSecondary">
					{title}
				</Typography>
				{/* 12k number of Cases */}
				<h2 className="infoBox__cases">{cases} </h2>
				{/* 1.2M Total */}
				<Typography className="infoBox__total" color="textSecondary">
					{total} Total
				</Typography>
			</CardContent>
		</Card>
	);
}

export default InfoBox;
