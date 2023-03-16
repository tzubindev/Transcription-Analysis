<script setup></script>

<template>
	<header class="w-full h-auto flex justify-start items-center bg-orange-400">
		<div class="p-4 text-white font-extrabold">Demo</div>
	</header>
	<main class="font-sans p-6 py-8">
		<h1 class="bg-white py-2 font-bold text-gray-500 border-b-2 border-gray-300 rounded-t-md">Transcription Analysis</h1>
		<div class="w-full max-h-[600px] sm:grid sm:grid-cols-2 shadow-md">
			<div class="max-h-[600px] p-2 px-4 pb-4 bg-white text-gray-500 overflow-y-auto">
				<div class="w-full flex justify-start text-sm font-semibold">Sentiment Distribution:</div>
				<div class="w-full h-6 mt-2 flex gap-2 px-2">
					<div class="bg-red-500 rounded-lg text-white flex items-center justify-center" :style="'width:' + sentiment.distribution.neg + '%;'">{{ sentiment.distribution.neg }}%</div>
					<div class="bg-green-500 rounded-lg text-white flex items-center justify-center" :style="'width:' + sentiment.distribution.pos + '%;'">{{ sentiment.distribution.pos }}%</div>
				</div>
				<div class="w-full flex justify-start items-center mt-4 flex-row">
					<p class="mr-4 text-sm font-semibold">Word Trends:</p>
					<input type="text" class="text-xs p-1 grow bg-transparent border-gray-300 border-b-2 focus:outline-none" v-model="search" @input="searchWords(search)" placeholder="Search..." />
				</div>
				<div class="w-full overflow-y-auto overflow-x-hidden max-h-[200px] flex-wrap flex gap-2 p-4 mt-2">
					<div v-for="w in words" :key="w.id" class="cursor-pointer hover:bg-gray-600 transition text-white text-xs p-2 px-4 bg-gray-500 rounded-md" :class="{ 'bg-red-500 hover:bg-red-600': w.isClicked, hidden: !w.isSearched }" @click="event_change('word_trends', w)">{{ w.word }}</div>
				</div>
				<div class="w-full flex justify-start items-center mt-3">
					<p class="mr-4 text-sm font-semibold">Top 5 Trending Keyphrases:</p>
				</div>
				<div class="w-full p-2 pb-0 py-1 mt-2 text-sm">
					<div class="w-full text-left mb-2" v-for="w in words.slice(0, 5)" :key="w.id">
						<div class="text-left w-full">{{ w.word }}</div>
						<div class="w-full flex mt-0.5">
							<div class="bg-amber-300 hover:bg-amber-400 transition rounded-lg" :style="'width:' + (w.count / highest_count) * 100 + '%;'"></div>
							<p class="mx-2">{{ w.count }}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-4 sm:mt-0 max-h-[600px] bg-[#f2f0f0]">
				<div class="p-2 px-1 h-full text-xs overflow-y-auto">
					<div v-for="c in conversations" :key="c.id" class="my-1">
						<div v-if="c.from === 'agent'" class="flex justify-end flex-wrap">
							<div v-if="c.content_type === 'text'" class="conv tooltip break-words shadow-md text-white font-semibold rounded-lg p-4 py-3 transition bg-orange-400 cursor-pointer hover:bg-orange-500 text-left float-right max-w-[80%]">
								<p>{{ c.content }}</p>
								<span class="tooltiptext-l bg-gray-800/80 text-white"
									><p>{{ c.sentiment }}</p>
									<p>Confidence: {{ c.confidence * 100 }}%</p></span
								>
							</div>
							<div class="rounded-full h-8 w-8 mx-2 mr-1 bg-[#393939] p-2"><img src="./assets/agent.png" /></div>
							<div class="mr-11 mt-0.5 text-right w-full text-[11px] font-light">{{ c.time }}</div>
						</div>
						<div v-if="c.from === 'client'" class="flex justify-start flex-wrap">
							<div class="rounded-full h-8 w-8 mx-2 mr-1 bg-green-400 p-2"><img src="./assets/customer.png" /></div>
							<div v-if="c.content_type === 'text'" class="conv tooltip break-words shadow-md text-gray-800 font-semibold rounded-lg p-4 py-3 transition bg-green-300 cursor-pointer hover:bg-green-400 text-left float-right max-w-[80%]">
								<p>{{ c.content }}</p>
								<span class="tooltiptext-r bg-gray-800/80 text-white"
									><p>{{ c.sentiment }}</p>
									<p>Confidence: {{ c.confidence * 100 }}%</p></span
								>
							</div>
							<div class="ml-11 mt-0.5 text-left w-full text-[11px] font-light">{{ c.time }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>

	<loader class="loader" v-if="isLoading"></loader>
</template>
<script>
import Loader from "./components/loader.vue";

export default {
	data() {
		return {
			isLoading: false,
			search: null,
			sentiment: {
				distribution: {
					pos: 10,
					neg: 90,
				},
			},
			highest_count: 10,
			words: [
				{ word: "package", isClicked: false, isSearched: true, count: 10 },
				{ word: "my", isClicked: false, isSearched: true, count: 8 },
				{ word: "vsdvs", isClicked: false, isSearched: true, count: 5 },
				{ word: "dsfwe", isClicked: false, isSearched: true, count: 3 },
				{ word: "qr12312312", isClicked: false, isSearched: true, count: 2 },
				{ word: "dsasdas", isClicked: false, isSearched: true, count: 2 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
				{ word: "qweqqweq", isClicked: false, isSearched: true, count: 1 },
			],
			conversations: [
				{ from: "agent", content_type: "text", content: "hello!", date: "15/03/2023", time: "09:48:00", sentiment: "Positive", confidence: 0.97 },
				{ from: "agent", content_type: "text", content: "How may I help you?", date: "15/03/2023", time: "09:48:00", sentiment: "Positive", confidence: 0.87 },
				{ from: "client", content_type: "text", content: "May I check for the expected arrival date of my package?", date: "15/03/2023", time: "09:48:00", sentiment: "Positive", confidence: 0.47 },
				{ from: "agent", content_type: "text", content: "Sure! May I have your package id, please.", date: "15/03/2023", time: "09:48:00", sentiment: "Positive", confidence: 0.17 },
				{ from: "client", content_type: "text", content: "It's AOS1239949123.", date: "15/03/2023", time: "09:48:00", sentiment: "Positive", confidence: 0.27 },
				{ from: "agent", content_type: "text", content: "Got it! Hold on for a minute, please.", date: "15/03/2023", time: "09:48:00", sentiment: "Positive", confidence: 0.33 },
				{ from: "agent", content_type: "text", content: "It's tomorrow, which is 16/03/2023. Any other enquiries?", date: "15/03/2023", time: "09:48:00", sentiment: "Positive", confidence: 0.65 },
				{ from: "client", content_type: "text", content: "No thanks.", date: "15/03/2023", time: "09:48:00", sentiment: "Positive", confidence: 0.34 },
				{ from: "agent", content_type: "text", content: "Happy to help you.", date: "15/03/2023", time: "09:48:00", sentiment: "Positive", confidence: 0.24 },
				{
					from: "agent",
					content_type: "text",
					content: "Happy to help you.asdnkoooooookkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkdasomdkoqmdoqwkodq mkdoqwdmkqow dmkqdo mqkwod qmkdoq mdkqod mqkoq wkdkoqw mdkqo",
					date: "15/03/2023",
					time: "09:48:00",
					sentiment: "Positive",
					confidence: 0.11,
				},
			],
		};
	},
	methods: {
		event_change(event_name, e) {
			if (event_name === "word_trends") {
				const re = new RegExp(e.word);

				var conversations = document.getElementsByClassName("conv");
				for (let conv of conversations) {
					let text = conv.getElementsByTagName("p")[0].innerHTML;
					if (re.test(text)) {
						if (!e.isClicked) {
							conv.getElementsByTagName("p")[0].innerHTML = conv.getElementsByTagName("p")[0].innerHTML.replace(e.word, '<span class="highlight">' + e.word + "</span>");
						} else {
							conv.getElementsByTagName("p")[0].innerHTML = conv.getElementsByTagName("p")[0].innerHTML.replace('<span class="highlight">' + e.word + "</span>", e.word);
						}
					}
				}

				e.isClicked = !e.isClicked;
			}
		},
		searchWords(word) {
			if (word) {
				const re = new RegExp(word, "i");
				this.words.forEach((node) => (node.isSearched = re.test(node.word)));
			} else this.words.forEach((node) => (node.isSearched = true));
		},
	},
	components: {
		Loader,
	},
};
</script>

<style>
body {
	-webkit-user-select: none; /* Safari */
	-ms-user-select: none; /* IE 10 and IE 11 */
	user-select: none; /* Standard syntax */
}

.highlight {
	background-color: #c35757;
	color: #fff;
	padding: 5px;
	border-radius: 8px;
}

.tooltip {
	position: relative;
	display: inline-block;
}

.tooltip .tooltiptext-r {
	top: -10px;
	left: 55%;
}

.tooltiptext-r,
.tooltiptext-l {
	transition: visibility 0.1s ease-in-out;
	visibility: hidden;
	width: 120px;
	text-align: center;
	border-radius: 2px;
	padding: 5px 0;

	/* Position the tooltip */
	position: absolute;
	z-index: 1;
}

.tooltip .tooltiptext-l {
	top: -10px;
	right: 55%;
}

.tooltip:hover .tooltiptext-l,
.tooltip:hover .tooltiptext-r {
	visibility: visible;
}

/* width */
::-webkit-scrollbar {
	width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 4px;
}

/* Handle */
::-webkit-scrollbar-thumb {
	background: #888;
	border: solid 2px #f1f1f1;
	border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	background: #555;
}
</style>
