<script setup></script>

<template>
	<header class="w-full h-auto flex justify-start items-center bg-orange-400">
		<div class="p-4 text-white font-extrabold">Demo</div>
	</header>
	<main class="font-sans p-6 py-8">
		<div class="grid grid-cols-3 gap-4">
			<div class="col-span-3 lg:col-span-2">
				<h1 class="bg-white py-2 font-bold text-gray-500 border-b-2 border-gray-300 rounded-t-md">Transcription Analysis</h1>
				<div class="block w-full max-h-[600px] sm:grid sm:grid-cols-2 shadow-md">
					<div class="max-h-[600px] p-2 px-4 pb-4 bg-white text-gray-500 overflow-y-auto">
						<div class="w-full flex justify-start text-sm font-semibold">Sentiment Distribution:</div>
						<div class="w-full h-6 mt-2 flex gap-1 px-2" v-if="sentiment">
							<div
								class="bg-red-500 hover:bg-red-400 rounded-lg text-white flex items-center justify-center cursor-pointer text-xs md:text-base"
								:style="'width:' + sentiment.distribution.neg + '%;'"
								:class="{ 'bg-red-600 hover:bg-red-400': isNegClicked }"
								@click="event_change('click_sentiment_negative', sentiment.distribution)"
							>
								{{ sentiment.distribution.neg }}%
							</div>
							<div
								class="bg-green-500 hover:bg-green-400 rounded-lg text-white flex items-center justify-center cursor-pointer text-xs md:text-base"
								:style="'width:' + sentiment.distribution.pos + '%;'"
								:class="{ 'bg-green-600 hover:bg-green-400': isPosClicked }"
								@click="event_change('click_sentiment_positive', sentiment.distribution)"
							>
								{{ sentiment.distribution.pos }}%
							</div>
						</div>
						<div class="shadow rounded-md p-4 w-full mt-2 bg-gray-200" v-if="!sentiment">
							<div class="animate-pulse flex space-x-4">
								<div class="flex-1 space-y-6 py-1">
									<div class="h-2 bg-slate-700 rounded"></div>
									<div class="space-y-3">
										<div class="grid grid-cols-3 gap-4">
											<div class="h-2 bg-slate-700 rounded col-span-2"></div>
											<div class="h-2 bg-slate-700 rounded col-span-1"></div>
										</div>
										<div class="h-2 bg-slate-700 rounded"></div>
									</div>
								</div>
							</div>
						</div>

						<div class="w-full flex justify-start items-center mt-4 flex-row">
							<p class="mr-4 text-sm font-semibold">Word Trends:</p>
							<input type="text" class="text-xs p-1 grow bg-transparent border-gray-300 border-b-2 focus:outline-none" v-model="search" @input="searchWords(search)" placeholder="Search..." />
						</div>
						<div class="w-full overflow-y-auto overflow-x-hidden max-h-[200px] flex-wrap flex gap-2 p-4 mt-2" v-if="words">
							<div
								v-for="w in words"
								:key="w.id"
								class="cursor-pointer transition text-white text-xs p-2 px-4 rounded-md"
								:class="{ 'bg-gray-500 hover:bg-gray-600': !w.isClicked, 'bg-blue-500 hover:bg-blue-600': w.isClicked && !w.isSensitive, 'bg-red-500 hover:bg-red-600': w.isClicked && w.isSensitive, hidden: !w.isSearched }"
								@click="event_change('word_trends', w)"
							>
								{{ w.word }}
							</div>
						</div>
						<div class="shadow rounded-md p-4 w-full mt-2 bg-gray-200" v-if="!words">
							<div class="animate-pulse flex space-x-4">
								<div class="flex-1 space-y-6 py-1">
									<div class="h-2 bg-slate-700 rounded"></div>
									<div class="space-y-3">
										<div class="grid grid-cols-3 gap-4">
											<div class="h-2 bg-slate-700 rounded col-span-2"></div>
											<div class="h-2 bg-slate-700 rounded col-span-1"></div>
										</div>
										<div class="h-2 bg-slate-700 rounded"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="w-full flex justify-start items-center mt-3">
							<p class="mr-4 text-sm font-semibold">Top 5 Trending Keyphrases:</p>
						</div>
						<div class="w-full p-2 pb-0 py-1 mt-2 text-sm" v-if="words">
							<div class="w-full text-left mb-2" v-for="w in words.slice(0, 5)" :key="w.id">
								<div class="text-left w-full">{{ w.word }}</div>
								<div class="w-full flex mt-0.5">
									<div class="bg-amber-300 hover:bg-amber-400 transition rounded-lg" :style="'width:' + (w.count / highest_count) * 100 + '%;'"></div>
									<p class="mx-2">{{ w.count }}</p>
								</div>
							</div>
						</div>
						<div class="shadow rounded-md p-4 w-full mt-2 bg-gray-200" v-if="!words">
							<div class="animate-pulse flex space-x-4">
								<div class="flex-1 space-y-6 py-1">
									<div class="h-2 bg-slate-700 rounded"></div>
									<div class="space-y-3">
										<div class="grid grid-cols-3 gap-4">
											<div class="h-2 bg-slate-700 rounded col-span-2"></div>
											<div class="h-2 bg-slate-700 rounded col-span-1"></div>
										</div>
										<div class="h-2 bg-slate-700 rounded"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="mt-4 sm:mt-0 max-h-[600px] bg-[#f2f0f0]">
						<div class="p-2 px-1 h-full text-xs overflow-y-auto overflow-x-hidden">
							<div v-for="c in conversations" :key="c.id" class="my-1">
								<div v-if="c.from === 'agent'" class="flex justify-end flex-wrap">
									<div
										v-if="c.content_type === 'text'"
										class="conv tooltip break-words shadow-md text-white font-semibold rounded-lg p-4 py-3 transition bg-orange-400 cursor-pointer hover:bg-orange-500 text-left float-right max-w-[80%]"
										:class="[{ 'border-positive': isPosClicked && c.sentiment === 'Positive' }, { 'border-negative': isNegClicked && c.sentiment === 'Negative' }]"
										@click="event_change('add_comment', c)"
									>
										<p class="leading-">{{ c.content }}</p>
										<span class="tooltiptext-l bg-gray-800/80 text-white"
											><p>{{ c.sentiment }}</p>
											<p>Confidence: {{ c.confidence * 100 }}%</p></span
										>
									</div>
									<div class="rounded-full h-8 w-8 mx-2 mr-0 mt-1 bg-[#393939] p-2"><img src="./assets/agent.png" /></div>
									<div class="w-full bg-white my-2 mx-2 p-4 shadow-lg rounded-2xl" v-if="c.isClicked">
										<h1 class="text-left font-bold mb-2">Add Comment</h1>
										<textarea id="addcomment" class="w-[98%] min-h-[50px] h-max-[100px] mb-2 p-2 bg-gray-100 outline outline-gray-800 outline-2 rounded-sm"></textarea>
										<div class="w-full flex justify-end">
											<button type="button" class="rounded-md bg-[#393939] py-2 px-2.5 text-xs font-semibold text-gray-100 shadow-sm hover:bg-[#222222] transition" @click="add_comment(c)">Add</button>
										</div>
									</div>
									<div class="mr-10 mt-0.5 text-right w-full text-[11px] font-light">{{ c.time }}</div>
								</div>
								<div v-if="c.from === 'client'" class="flex justify-start flex-wrap">
									<div class="rounded-full h-8 w-8 mx-2 bg-green-400 p-2 mt-1"><img src="./assets/customer.png" /></div>
									<div
										v-if="c.content_type === 'text'"
										class="conv tooltip break-words shadow-md text-gray-800 font-semibold rounded-lg p-4 py-3 transition bg-green-300 cursor-pointer hover:bg-green-400 text-left float-right max-w-[80%]"
										:class="[{ 'border-positive': isPosClicked && c.sentiment === 'Positive' }, { 'border-negative': isNegClicked && c.sentiment === 'Negative' }]"
										@click="event_change('add_comment', c)"
									>
										<p class="leading-5">{{ c.content }}</p>
										<span class="tooltiptext-r bg-gray-800/80 text-white"
											><p>{{ c.sentiment }}</p>
											<p>Confidence: {{ c.confidence * 100 }}%</p></span
										>
									</div>
									<div class="w-full bg-white my-2 mx-2 p-4 shadow-lg rounded-2xl" v-if="c.isClicked">
										<h1 class="text-left font-bold mb-2">Add Comment</h1>
										<textarea id="addcomment" class="w-[98%] min-h-[50px] h-max-[100px] mb-2 p-2 bg-gray-100 outline outline-gray-800 outline-2 rounded-sm"></textarea>
										<div class="w-full flex justify-end">
											<button type="button" class="rounded-md bg-[#393939] py-2 px-2.5 text-xs font-semibold text-gray-100 shadow-sm hover:bg-[#222222] transition" @click="add_comment(c)">Add</button>
										</div>
									</div>
									<div class="ml-12 mt-0.5 text-left w-full text-[11px] font-light">{{ c.time }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="hidden sm:block col-span-3 lg:col-span-1">
				<h1 class="bg-white py-2 font-bold text-gray-500 border-b-2 border-gray-300 rounded-t-md">Comment</h1>
				<div class="block w-full max-h-[600px] shadow-md">
					<div class="max-h-[600px] p-8 px-6 bg-white text-gray-500 overflow-y-auto rounded-b-md" v-if="isCommentEditShowable">
						<div class="relative mb-4">
							<label for="comment" class="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900">Modify Your Comment Here</label>
							<textarea name="comment" id="comment" class="block w-full rounded-md border-0 p-4 min-h-[200px] bg-white text-gray-900 shadow-sm outline outline-2 outline-black placeholder:text-gray-400 sm:text-sm sm:leading-6" />
						</div>
						<div class="w-full flex justify-end">
							<button type="button" class="rounded-md bg-[#393939] py-2.5 px-3.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-[#222222] transition">Save</button>
						</div>
					</div>
					<div class="max-h-[600px] p-8 px-6 bg-white text-gray-500 overflow-y-auto rounded-b-md" v-if="!isCommentEditShowable">
						<div>No conversation is selected.</div>
					</div>
				</div>
			</div>
		</div>
	</main>

	<loader class="loader" v-if="isLoading"></loader>
</template>
<script>
import { onBeforeMount } from "vue";
import Loader from "./components/loader.vue";

export default {
	data() {
		return {
			isLoading: false,
			search: null,
			isCommentEditShowable: false,
			isNegClicked: false,
			isPosClicked: false,
			sentiment: null,
			highest_count: null,
			words: null,
			conversations: null,
		};
	},
	methods: {
		waitForEle(id) {
			return new Promise((resolve) => {
				if (document.querySelector(id)) {
					return resolve(true);
				}

				const observer = new MutationObserver((mutations) => {
					if (document.querySelector(id)) {
						resolve(true);
						observer.disconnect();
					}
				});

				observer.observe(document.body, {
					childList: true,
					subtree: true,
				});
			});
		},
		async event_change(event_name, e) {
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
			if (event_name === "click_sentiment_positive") {
				this.isPosClicked = !this.isPosClicked;
			}
			if (event_name === "click_sentiment_negative") {
				this.isNegClicked = !this.isNegClicked;
			}
			if (event_name === "add_comment") {
				if (!e.isClicked) {
					this.conversations.forEach((node) => (node.isClicked = false));
					e.isClicked = !e.isClicked;
					this.isCommentEditShowable = true;
					if (await this.waitForEle("#comment")) document.getElementById("comment").value = e.comment;
				} else {
					e.isClicked = !e.isClicked;
					this.isCommentEditShowable = false;
				}
			}
		},
		searchWords(word) {
			if (word) {
				const re = new RegExp(word, "i");
				this.words.forEach((node) => (node.isSearched = re.test(node.word)));
			} else this.words.forEach((node) => (node.isSearched = true));
		},
		async add_comment(e) {
			console.log(document.getElementById("addcomment").value);
			await this.postData(document.getElementById("addcomment").value);
			console.log("POSTED");
		},
		async postData(e) {
			this.isLoading = true;
			var getData = null;
			await fetch("http://127.0.0.1:8000/stt/test", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: {
					comment: e,
				},
			})
				.then((Response) => Response.json())
				.then(function (data) {
					getData = data;
				});
			console.log("POST", getData);
			this.isLoading = false;
		},
	},
	components: {
		Loader,
	},
	created() {
		const fetchData = async () => {
			this.isLoading = true;
			var getData = null;
			await fetch("http://127.0.0.1:8000/stt/test", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((Response) => Response.json())
				.then(function (data) {
					getData = data;
				});
			this.sentiment = getData.sentiment;
			this.highest_count = getData.highest_count;
			this.words = getData.words;
			this.conversations = getData.conversations;
			this.isLoading = false;
		};
		fetchData();
	},
};
</script>

<style>
body {
	-webkit-user-select: none; /* Safari */
	-ms-user-select: none; /* IE 10 and IE 11 */
	user-select: none; /* Standard syntax */
}

.border-positive {
	border: solid 3px #22c55e;
}
.border-negative {
	border: solid 3px #ef4444;
}
.highlight-s,
.highlight {
	color: #fff;
	padding: 1px 0.5rem;
	margin: 0 0.25rem;
	border-radius: 6px;
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
