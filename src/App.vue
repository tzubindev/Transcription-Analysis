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
					<div
						v-for="w in words"
						:key="w.id"
						class="cursor-pointer hover:bg-gray-600 transition text-white text-xs p-2 px-4 bg-gray-500 rounded-md"
						:class="{ 'bg-blue-500 hover:bg-blue-600': w.isClicked && !w.isSensitive, 'bg-red-500 hover:bg-red-600': w.isClicked && w.isSensitive, hidden: !w.isSearched }"
						@click="event_change('word_trends', w)"
					>
						{{ w.word }}
					</div>
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
							<div class="rounded-full h-8 w-8 mx-2 mr-0 mt-1 bg-[#393939] p-2"><img src="./assets/agent.png" /></div>
							<div class="mr-11 mt-0.5 text-right w-full text-[11px] font-light">{{ c.time }}</div>
						</div>
						<div v-if="c.from === 'client'" class="flex justify-start flex-wrap">
							<div class="rounded-full h-8 w-8 mx-2 bg-green-400 p-2 mt-1"><img src="./assets/customer.png" /></div>
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
			sentiment: null,
			highest_count: null,
			words: null,
			conversations: null,
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
							if (!e.isSensitive) conv.getElementsByTagName("p")[0].innerHTML = conv.getElementsByTagName("p")[0].innerHTML.replace(e.word, '<span class="highlight">' + e.word + "</span>");
							else conv.getElementsByTagName("p")[0].innerHTML = conv.getElementsByTagName("p")[0].innerHTML.replace(e.word, '<span class="highlight-s">' + e.word + "</span>");
						} else {
							let target = "highlight";
							if (e.isSensitive) target = "highlight-s";
							conv.getElementsByTagName("p")[0].innerHTML = conv.getElementsByTagName("p")[0].innerHTML.replace(`<span class="${target}">` + e.word + "</span>", e.word);
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
	async created() {
		var getData = null;
		await fetch("http://127.0.0.1:8000/stt/test", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "http://127.0.0.1:8000",
				"Access-Control-Allow-Methods": "GET",

				// like application/json or text/xml
			},
			// body: {
			// 	// Example: Update JSON file with
			// 	//          local data properties
			// 	// postTitle: this.title,
			// 	// postAuthor: this.author,
			// 	// etc.
			// },
		})
			.then((Response) => Response.json())
			.then(function (data) {
				getData = data;
			});
		this.sentiment = getData.sentiment;
		this.highest_count = getData.highest_count;
		this.words = getData.words;
		this.conversations = getData.conversations;
	},
};
</script>

<style>
body {
	-webkit-user-select: none; /* Safari */
	-ms-user-select: none; /* IE 10 and IE 11 */
	user-select: none; /* Standard syntax */
}

.highlight-s,
.highlight {
	color: #fff;
	padding: 0.25rem 0.5rem;
	border-radius: 10px;
}
.highlight {
	background-color: rgb(59 130 246);
}

.highlight-s {
	background-color: rgb(239 68 68);
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
	background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
	background: #8d8d8d;
	border: solid 2px rgba(255, 255, 255, 0.9);
	border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	background: #555;
}
</style>
