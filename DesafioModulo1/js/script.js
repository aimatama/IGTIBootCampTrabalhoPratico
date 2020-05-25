/**
 * Estado da aplicação (state)
 */
let tabPersonFound = null;
let tabStatistics = null;

let allPeople = [];
let foundPeople = [];

let sumAgesResult = 0;
let avgAgesResult = 0;
let countFoundGenderFemale = 0;
let countFoundGenderMale = 0;

window.addEventListener('load', () => {
  openModal();
  tabPersonFound = document.querySelector('#tabPersonFound');
  tabStatistics = document.querySelector('#tabStatistics');
  fetchPeople();
});

async function fetchPeople() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  allPeople = json.results.map((person) => {
    return {
      id: person.login.uuid,
      name: person.name.first + ' ' + person.name.last,
      age: person.dob.age,
      picture: person.picture.large,
      gender: person.gender,
    };
  });
  addEventListenerSearch();
  closeModal();
}

function addEventListenerSearch() {
  txtNameSearch.addEventListener('keyup', (event) => {
    //if (event.key === 'Enter') {
    btnNameSearch.click();
    //}
  });
  btnNameSearch.addEventListener('click', (event) => {
    render();
  });
}

function render() {
  filterPeople();
  if (foundPeople) {
    renderPeopleFoundList();
    renderSummary();
  } else {
    renderNoPeopleFoundList();
    renderSummary();
  }
}

function filterPeople() {
  let name = txtNameSearch.value.toLowerCase();

  if (name.trim() === '') {
    foundPeople = null;
    return;
  }
  const found = allPeople.filter((person) => {
    return person.name.toLowerCase().includes(name);
  });
  foundPeople = found.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

function renderPeopleFoundList() {
  let htmlCounterPeopleFound = counterPeopleFound();

  let peopleHTML = `
    <table class="highlight">
    <tbody>
  `;

  foundPeople.forEach((person) => {
    const { name, picture, id, age } = person;
    peopleHTML += `
        <tr>
            <td width="20%">
            <img src="${picture}" alt="${name}">
            </td>
            <td width="80%">
            <span>${name}, ${age} anos</span>
            </td>
        </tr>
      `;
  });

  peopleHTML += `
    </tbody>
  </table>
  `;

  tabPersonFound.innerHTML = htmlCounterPeopleFound + peopleHTML;
}

function renderNoPeopleFoundList() {
  let html = `<div class="card-panel white-text teal lighten-2 spanTitle"><h5 class="center-align">Nenhum usuário filtrado</div>`;
  tabPersonFound.innerHTML = html;
}

function counterPeopleFound() {
  let html;
  lblcounterPeopleFound = document.querySelector('#lblcounterPeopleFound');
  if (foundPeople) {
    const counterPeople = foundPeople.length;
    html = `<div class="card-panel white-text teal lighten-2 spanTitle"><h5 class="center-align">${counterPeople} usuário(s) encontrado(s)</div>`;
  } else {
    html = `<div class="card-panel white-text teal lighten-2 spanTitle"><h5 class="center-align">Nenhum usuário filtrado</div>`;
  }
  return html;
}

function renderSummary() {
  let countFoundPeople = 0;
  if (foundPeople) {
    countFoundPeople = foundPeople.length;
  }
  if (countFoundPeople === 0) {
    showNoPeople();
  } else {
    showStatisticsPeople();
  }
}

function showStatisticsPeople() {
  calcStatisticsPeople();

  let statistcsPeopleShow = `
    <div class="card-panel white-text teal lighten-2 spanTitle"><h5 class="center-align">Estatísticas</div>
    <table class="highlight">
    <tbody>
  `;

  statistcsPeopleShow += `
    <tr>
        <td width="70%">
        <span>Sexo Masculino:</span>
        </td>
        <td width="30%">
        <span>${countFoundGenderMale}</span>
        </td>
    </tr>
    <tr>
        <td width="70%">
        <span>Sexo Feminino:</span>
        </td>
        <td width="30%">
        <span>${countFoundGenderFemale}</span>
        </td>
    </tr>
    <tr>
        <td width="70%">
        <span>Soma das Idades:</span>
        </td>
        <td width="30%">
        <span>${sumAgesResult}</span>
        </td>
    </tr>
    <tr>
        <td width="70%">
        <span>Média das Idades:</span>
        </td>
        <td width="30%">
        <span>${avgAgesResult}</span>
        </td>
    </tr>
    `;

  statistcsPeopleShow += `
    </tbody>
  </table>
  `;

  tabStatistics.innerHTML = statistcsPeopleShow;
}

function calcStatisticsPeople() {
  sumAgesResult = sumAges();
  avgAgesResult = formatNumber(avgAges(sumAgesResult));
  countFoundGenderFemale = countGender('female');
  countFoundGenderMale = countGender('male');
}

function countGender(gender) {
  const countFoundGender = foundPeople
    .filter((person) => {
      return person.gender === gender;
    })
    .reduce((accumulator, current) => {
      return accumulator + 1;
    }, 0);
  return countFoundGender;
}

function sumAges() {
  const sumAgesResult = foundPeople.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);
  return sumAgesResult;
}

function avgAges(sumAgesResult) {
  const avgAgesResult = sumAgesResult / foundPeople.length;
  return avgAgesResult;
}

function showNoPeople() {
  const noPeopleShow = `<div class="card-panel white-text teal lighten-2 spanTitle"><h5 class="center-align">Estatísticas</h5></div><p>Nada a ser exibido</p>`;
  tabStatistics.innerHTML = noPeopleShow;
}

function openModal() {
  const elem = document.getElementById('modal1');
  const instance = M.Modal.init(elem, { dismissible: false });
  instance.open();
}

function closeModal() {
  const elem = document.getElementById('modal1');
  const instance = M.Modal.init(elem, { dismissible: false });
  instance.close();
}

function formatNumber(number) {
  numberFormat = Intl.NumberFormat('pt-BR');
  return numberFormat.format(number);
}
