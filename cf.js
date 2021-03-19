
  // @ts-check
/// <reference lib="es2020"/>
/// <reference types="jquery"/>
/// <reference types="vue"/>
/// <reference types="moment"/>

const teamLogos = {
  'برشلونة': 'https://ssl.gstatic.com/onebox/media/sports/logos/paYnEE8hcrP96neHRNofhQ_96x96.png',
  'هويسكا': 'https://ssl.gstatic.com/onebox/media/sports/logos/S72MCTiOGlQRhTfHW0uf9A_96x96.png',
};
const ligaLogos = {
  'الدوري الاسباني': 'https://lh3.googleusercontent.com/-nFMt8gUn3qA/XXaxHUSTosI/AAAAAAAACfk/BQTC1srkSDYe3dVCf9D7AuULUHMoT7X1gCLcBGAs/s1600/LaLiga.png',
};

const channelsNames = [
	'بي ان سبورت 1',
];

const commentatorsNames = [
	'حفيظ دراجي',
];

const teamsNames = [
  // you can add team name without logo example
  // 'team name',
  ...Object.keys(teamLogos),
];
const ligasNames = [
  // you can add liga name without logo example
  // 'liga name',
  ...Object.keys(ligaLogos),
];

/**
 * @type {typeof import('vue')}
 */
const {
  createApp,
  reactive,
  watch,
  ref,
  computed,
  onMounted,
  defineComponent,
  // @ts-ignore
} = Vue;

const App = defineComponent({
  setup() {
  	const state = reactive({
    	savedMatches: []
    });
    if (localStorage.getItem('savedMatches')) {
      // comment this line to use default info
      const matches = JSON.parse(localStorage.getItem('savedMatches'));
      state.savedMatches.push(...matches);
    }
    const defaultMatch = {
      team1: 'برشلونة',
      team2: 'هويسكا',
      team1Logo: '',
      team2Logo: '',
      liga: 'الدوري الاسباني',
      ligaLogo: '',
      channel: 'بي ان سبورت 1',
      commentator: 'حفيظ دراجي',
      timeStart: '2021-03-15T22:00',
      timeEnd: '2021-03-16T00:00',
      result: '1-3',
      link: '#',
    };
    const info = reactive(state.savedMatches[0] || defaultMatch);
    watch(() => state.savedMatches, () => {
      localStorage.setItem('savedMatches', JSON.stringify(state.savedMatches));
    }, { deep: true });
    const saveMatch = () => {
    	state.savedMatches.unshift(
      	JSON.parse(JSON.stringify(info))
      );
    };
    const outputCode = ref('');
    watch(() => info.team1, () => {
      if (teamLogos[info.team1]) info.team1Logo = teamLogos[info.team1] || '';
    }, {
      immediate: true
    });
    watch(() => info.team2, () => {
      if (teamLogos[info.team2]) info.team2Logo = teamLogos[info.team2] || '';
    }, {
      immediate: true
    });
    watch(() => info.liga, () => {
      info.ligaLogo = ligaLogos[info.liga] || '';
    }, {
      immediate: true
    });
    /** @param {typeof defaultMatch} info */
    const generateCodeFromInfo = (info) => {
      const date = new Date(info.timeStart);
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const time_am_pm = hours >= 12 ? 'م' : 'ص';
			info.result = info.result.trim() || '0-0';
      // convert
      // 2021-03-15T22:00
      // to
      // 2021-03-15T22:00:00+01:00
      // 2021-03-17T15:00:00+02:00
      // moment(info.timeStart).format();
      const status = +new Date(info.timeEnd) - Date.now() < 0
        ? 'end'
        : (
          +new Date(info.timeStart) - Date.now() < 0
          ? 'live'
          : 'not-start'
        );
      return `
<div data-result="${info.result}" class="match-event ${status === 'not-start' ? 'notstart' : status === 'live' ? 'ch-live' : 'ch-end'}" title="${info.team1 + ' vs ' + info.team2}">
  <div id="match-live">
    <a href="${info.link}">
      <div id="overlay-match">
        <div id="watch-match"></div>
      </div>
    </a>
  </div>
  <div class="first-team">
    <div class="team-logo">
      <img alt="${info.team1}"
        content="${info.team1Logo}"
        height="70" width="70"
        src="${info.team1Logo}"
        title="${info.team1}">
    </div>
    <div class="team-name">${info.team1}</div>
  </div>
  <div class="match-time">
    <div class="match-timing">
      ${
        status === 'not-start' && +new Date(info.timeStart) - Date.now() < 1000 * 60 * 60 * 24
        ? (
          +new Date(info.timeStart) - Date.now() > 1000 * 60 * 60
          ? `<div id="match-hour">تبقى ${Math.round((+new Date(info.timeStart) - Date.now()) / 1000 / 60 / 60)} ساعة</div>`
          : `<div id="match-hour">تبقى ${Math.round((+new Date(info.timeStart) - Date.now()) / 1000 / 60)} دقيقة</div>`
        )
        : `<div id="match-hour">${hours % 12}:${minutes} ${time_am_pm}</div>`
      }
      <div id="result-now">${info.result}</div>
      <div 
        data-start="${moment(info.timeStart).format()}"
        data-gameends="${moment(info.timeEnd).format()}"
        class="match-date ${status}">${
          status === 'end'
          ? 'إنتهت المباراة'
          : (
            status === 'live'
            ? 'جارية الآن'
            : (
              +new Date(info.timeStart) - Date.now() > 1000 * 60 * 15
              ? 'لم تبدا بعد'
              : 'بعد قليل'
            )
          )
        }</div>
    </div>
  </div>
  <div class="left-team">
    <div class="team-logo">
      <img alt="${info.team2}"
      content="${info.team2Logo}"
      height="70" width="70"
      src="${info.team2Logo}"
      title="${info.team2}"
      />
    </div>
    <div class="team-name">${info.team2}</div>
  </div>
  <div class="match-info">
    <ul>
      <li><span>${info.channel}</span></li>
      <li><span>${info.commentator}</span></li>
      <li><span><img src="${info.ligaLogo}" width="24" height="24" alt="${info.liga}">${info.liga}</span></li>
    </ul>
  </div>
</div>
      `.trim();
    };

    function escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    /** @param {typeof defaultMatch} info */
    const escapeInfo = info => {
      /** @type {typeof defaultMatch} */
      // @ts-ignore
    	const escapedInfo = {};
    	for (const key of Object.keys(info)) {
        escapedInfo[key] = escapeHtml(info[key]);
      }
      return escapedInfo;
    }
    const savedMatchesWithCodes = computed(() => state.savedMatches.map(info => {
    	return {
      	code: generateCodeFromInfo(escapeInfo(info)),
        info
      };
    }));
    const generateCode = () => {
      const escapedInfo = {};
      for (const key of Object.keys(info)) {
        escapedInfo[key] = escapeHtml(info[key]);
      }
      outputCode.value = generateCodeFromInfo(escapeInfo(info));
    };
    const apiInfoClick = e => {
    	const matchDiv = e.target.closest('.match-event');
      if (!matchDiv) return;
      const matchInfo = {};
      {
        const a = matchDiv.querySelector('a');
        if (a) matchInfo.link = a.getAttribute('href');
      }
      {
        const div = matchDiv.querySelector('.first-team .team-name');
        if (div) matchInfo.team1 = div.innerText;
      }
      {
        const div = matchDiv.querySelector('.left-team .team-name');
        if (div) matchInfo.team2 = div.innerText;
      }
      {
      	const div = matchDiv.querySelector('.match-info li:nth-child(1) > span');
        if (div) matchInfo.channel = div.innerText;
      }
      {
      	const div = matchDiv.querySelector('.match-info li:nth-child(2) > span');
        if (div) matchInfo.commentator = div.innerText;
      }
      {
      	const div = matchDiv.querySelector('.match-info li:nth-child(3) > span');
        if (div) matchInfo.liga = div.innerText;
        if (!ligaLogos[matchInfo.liga]) {
          const img = matchDiv.querySelector('.match-info li:nth-child(3) > span > img');
          if (img) ligaLogos[matchInfo.liga] = img.getAttribute('src');
        }
      }
      {
      	const div = matchDiv.querySelector('#result-now');
        if (div) matchInfo.result = div.innerText;
      }
      {
      	const div = matchDiv.querySelector('.match-date');
        if (div) {
        	matchInfo.timeStart = moment(div.getAttribute('data-start')).format(moment.HTML5_FMT.DATETIME_LOCAL);
        	matchInfo.timeEnd = moment(div.getAttribute('data-gameends')).format(moment.HTML5_FMT.DATETIME_LOCAL);
        }
      }
      if (matchInfo.team1) {
      	if (!teamLogos[matchInfo.team1]) {
          const img = matchDiv.querySelector('.first-team .team-logo img');
          if (img) teamLogos[matchInfo.team1] = img.getAttribute('src');
        }
        matchInfo.team1Logo = teamLogos[matchInfo.team1] || '';
      }
      if (matchInfo.team2) {
        if (!teamLogos[matchInfo.team2]) {
          const img = matchDiv.querySelector('.left-team .team-logo img');
          if (img) teamLogos[matchInfo.team2] = img.getAttribute('src');
        }
      	matchInfo.team2Logo = teamLogos[matchInfo.team2] || '';
      }
      if (matchInfo.liga) {
      	matchInfo.ligaLogo = ligaLogos[matchInfo.liga] || '';
      }
      if (!teamsNames.includes(matchInfo.team1)) {
        teamsNames.push(matchInfo.team1);
      }
      if (!teamsNames.includes(matchInfo.team2)) {
        teamsNames.push(matchInfo.team2);
      }
      if (!ligasNames.includes(matchInfo.liga)) {
        ligasNames.push(matchInfo.liga);
      }
      if (!commentatorsNames.includes(matchInfo.commentator)) {
        commentatorsNames.push(matchInfo.commentator);
      }
      if (!channelsNames.includes(matchInfo.channel)) {
        channelsNames.push(matchInfo.channel);
      }
      const missingInfo = Object.keys(info).filter(key => !(key in matchInfo));
      if (missingInfo.length) {
      	console.warn('missing', missingInfo);
      }
      Object.assign(info, matchInfo);
    };

    // comment this line to disable auto generate code
    watch(info, generateCode, {
      immediate: true
    });
    
    return {
      info,
      teamsNames,
      ligasNames,
      channelsNames,
      commentatorsNames,
      generateCode,
      outputCode,
      saveMatch,
      state,
      savedMatchesWithCodes,
      apiInfoClick,
    };
  }
});

const CustomSelect = defineComponent({
  template: `
  <vue-select
    v-model="otherValue"
    :options="options"
    :visible-options="visibleOptions"
    searchable
    close-on-select
    clear-on-select
    empty-model-value=""
    search-placeholder="إبحث"
    @search:input="hanldeSearchInput"
  ></vue-select>
  `,
  props: {
    value: String,
    /** @type {import('vue').PropType<string[]>} */
    options: Array,
  },
  setup(props, ctx) {
    const otherValue = ref(props.value);
    watch(() => props.value, () => otherValue.value = props.value);
    watch(otherValue, () => ctx.emit('update', otherValue.value));
    const searchInput = ref('');
    const hanldeSearchInput = event => {
      searchInput.value = event.target.value;
    };
    const visibleOptions = computed(() => {
      const re = new RegExp(searchInput.value.toLowerCase().replace(/[.*+?^${}()|[]\]/, '\$&'), 'i');
      return props.options.filter(option => re.test(option)).slice(0, 10);
    });

    return {
      hanldeSearchInput,
      visibleOptions,
      otherValue,
    };
  }
});

{ 
  const app = createApp(App);
  // @ts-ignore
  app.component('vue-select', VueNextSelect);
  app.component('custom-select', CustomSelect);
  /** @type {HTMLDivElement} */
  const container = document.querySelector('#app');
  app.mount(container);
  container.style.visibility = '';
}
