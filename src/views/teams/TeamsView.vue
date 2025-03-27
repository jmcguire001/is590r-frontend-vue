<template>
	<v-container>
		<v-row>
			<v-col
				v-for="team in teams"
				:key="team.id"
				cols="12"
				sm="6"
				md="4"
				lg="3"
			>
				<v-card class="flip-card" @click="toggleFlip(team.id)">
					<v-card-text v-if="flippedCard !== team.id" class="front">
						<h3 class="text-center">{{ team.teamAbbr }}</h3>
						<v-img
							:src="team.teamLogo"
							aspect-ratio="1"
							class="team-logo"
						></v-img>
						<div>
							<h4>{{ team.teamName }}</h4>
							<p>{{ team.teamMascot }}</p>
						</div>
					</v-card-text>

					<v-card-text v-else class="back">
						<p>
							<strong>Conference:</strong>
							{{ team.teamConference }}
						</p>
						<p>
							<strong>City:</strong> {{ team.teamCity }},
							{{ team.teamState }}
						</p>
						<p><strong>Country:</strong> {{ team.teamCountry }}</p>
						<p><strong>Stadium:</strong> {{ team.teamStadium }}</p>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script src="./TeamsView.ts"></script>

<style src="./TeamsView.scss"></style>
