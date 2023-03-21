<template>
	<div class="screen bg-orange-400">
		<div class="title text-white font-extrabold text-3xl">{{ title }}</div>
		<div class="preloader" :style="cssVars">
			<span class="rot-1"></span>
			<span class="rot-2"></span>
			<span class="rot-3"></span>
			<span class="rot-4"></span>
		</div>
	</div>
</template>

<script>
export default {
	name: "Loader",
	props: {
		title: {
			type: String,
			default: "Title",
		},
		color: {
			type: String,
			default: "#fff",
		},
		scale: {
			type: Number,
			default: 1,
		},
	},
	computed: {
		cssVars() {
			return {
				"--color": this.color,
				"--scale": this.scale,
			};
		},
	},
};
</script>

<style scoped>
.title {
	position: relative;
	height: 50px;
	top: 50%;
	margin-bottom: 10px;
}
.screen {
	width: 400px;
	height: auto;
	padding: 2rem 2rem 1rem 2rem;
	top: 50%;
	left: 50%;
	position: fixed;
	transform: translate(-50%, -50%);
	border-radius: 20px;
}

.preloader {
	position: relative;
	width: 50px;
	height: 50px;
	top: 50%;
	left: 10px;
	margin: auto;
	transform: scale(var(--scale));
}

.preloader > span {
	position: absolute;
	background-color: transparent;
	height: 8px;
	width: 8px;
	border-radius: 12px;
	animation-name: f_fadeG;
	animation-duration: 0.4s;
	animation-iteration-count: infinite;
	animation-direction: normal;
}

.rot-1 {
	left: 0;
	top: 0;
	animation-delay: 0.1s;
}

.rot-2 {
	left: 15px;
	top: 0;
	animation-delay: 0.2;
}

.rot-3 {
	left: 15px;
	top: 15px;
	animation-delay: 0.3s;
}

.rot-4 {
	left: 0;
	top: 15px;
	animation-delay: 0.4s;
}

@keyframes f_fadeG {
	0% {
		background-color: var(--color);
	}
	100% {
		background-color: transparent;
	}
}
</style>
