<template>
	<div class="screen">
		<div class="title text-orange-400 font-extrabold text-3xl">Loading Data</div>
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
		color: {
			type: String,
			default: "#fb923c",
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
	background-color: rgba(0, 0, 0, 0.74);
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
	animation-duration: 1.2s;
	animation-iteration-count: infinite;
	animation-direction: normal;
}

.rot-1 {
	left: 0;
	top: 0;
	animation-delay: 0.45s;
}

.rot-2 {
	left: 15px;
	top: 0;
	animation-delay: 0.75s;
}

.rot-3 {
	left: 15px;
	top: 15px;
	animation-delay: 1.05s;
}

.rot-4 {
	left: 0;
	top: 15px;
	animation-delay: 1.35s;
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
