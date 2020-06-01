import fs from 'fs';

let dataStates = [];
let dataCities = [];
const filePathStatesJson =
  'TrabalhoPratico\\TrabalhoPraticoModulo2\\data\\Estados.json';
const filePathCitiesJson =
  'TrabalhoPratico\\TrabalhoPraticoModulo2\\data\\Cidades.json';
const filePathCitiesStatesJson =
  'TrabalhoPratico\\TrabalhoPraticoModulo2\\data\\';

function deserializeStates() {
  const data = fs.readFileSync(filePathStatesJson);
  dataStates = JSON.parse(data);
}

function deserializeCities() {
  const data = fs.readFileSync(filePathCitiesJson);
  const citiesNames = JSON.parse(data).map((city) => {
    const { ID, Nome, Estado } = city;
    return {
      ID: ID,
      Nome: Nome,
      Estado: Estado,
      QtdeLetras: Nome.length,
    };
  });
  dataCities = citiesNames;
}

function createStateFiles() {
  dataStates.forEach((state) => {
    let citiesState = dataCities.filter((city) => city.Estado === state.ID);
    fs.writeFileSync(
      filePathCitiesStatesJson + state.Sigla + '.json',
      JSON.stringify(citiesState)
    );
  });
}

function showCitiesState() {
  dataStates.forEach((state) => {
    const data = fs.readFileSync(
      filePathCitiesStatesJson + '\\' + state.Sigla + '.json'
    );
    const dataCitiesState = JSON.parse(data);
    console.log(
      `UF: ${state.Sigla} || Quantidade de Cidades: ${dataCitiesState.length}.`
    );

    state.QtdeCidades = dataCitiesState.length;
  });
}

function showStatesMoreCities(numberOfStates) {
  dataStates
    .sort((a, b) =>
      a.QtdeCidades < b.QtdeCidades ? 1 : b.QtdeCidades < a.QtdeCidades ? -1 : 0
    )
    .slice(0, numberOfStates)
    .forEach((state) => {
      console.log(
        `UF: ${state.Sigla} || Quantidade de Cidades: ${state.QtdeCidades}.`
      );
    });
}

function showStatesFewerCities(numberOfStates) {
  dataStates
    .sort((a, b) =>
      a.QtdeCidades > b.QtdeCidades ? 1 : b.QtdeCidades > a.QtdeCidades ? -1 : 0
    )
    .slice(0, numberOfStates)
    .sort((a, b) =>
      a.QtdeCidades < b.QtdeCidades ? 1 : b.QtdeCidades < a.QtdeCidades ? -1 : 0
    )
    .forEach((state) => {
      console.log(
        `UF: ${state.Sigla} || Quantidade de Cidades: ${state.QtdeCidades}.`
      );
    });
}

function showStateCityLongerName(numberOfStates, state = null) {
  let citiesState = [];
  if (state != null) {
    citiesState = dataCities
      .filter((city) => city.Estado === state.ID)
      .sort((a, b) =>
        a.QtdeLetras < b.QtdeLetras ? 1 : b.QtdeLetras < a.QtdeLetras ? -1 : 0
      );
  } else {
    citiesState = dataCities.sort((a, b) =>
      a.QtdeLetras < b.QtdeLetras ? 1 : b.QtdeLetras < a.QtdeLetras ? -1 : 0
    );
  }
  const qtdeLetras = citiesState[0].Nome.length;

  const citiesState2 = citiesState.filter(
    (city) => city.Nome.length === qtdeLetras
  );

  const citiesState3 = citiesState2
    .sort((a, b) => {
      return a.Nome.localeCompare(b.Nome);
    })
    .slice(0, numberOfStates)
    .forEach((city) => {
      console.log(
        `Nome da Cidade: ${city.Nome} || UF: ${
          defineNameState(city.Estado).Sigla
        } || Quantidade de Letras: ${city.QtdeLetras}.`
      );
    });
}

function showStateCityShorterName(numberOfStates, state = null) {
  let citiesState = [];
  if (state != null) {
    citiesState = dataCities
      .filter((city) => city.Estado === state.ID)
      .sort((a, b) =>
        a.QtdeLetras > b.QtdeLetras ? 1 : b.QtdeLetras > a.QtdeLetras ? -1 : 0
      );
  } else {
    citiesState = dataCities.sort((a, b) =>
      a.QtdeLetras > b.QtdeLetras ? 1 : b.QtdeLetras > a.QtdeLetras ? -1 : 0
    );
  }
  const qtdeLetras = citiesState[0].Nome.length;

  const citiesState2 = citiesState.filter(
    (city) => city.Nome.length === qtdeLetras
  );

  const citiesState3 = citiesState2
    .sort((a, b) => {
      return a.Nome.localeCompare(b.Nome);
    })
    .slice(0, numberOfStates)
    .forEach((city) => {
      console.log(
        `Nome da Cidade: ${city.Nome} || UF: ${
          defineNameState(city.Estado).Sigla
        } || Quantidade de Letras: ${city.QtdeLetras}.`
      );
    });
}

function defineNameState(stateID) {
  return dataStates.filter((state) => state.ID === stateID)[0];
}

deserializeStates();
deserializeCities();

console.log(
  '1. Implementar um método que irá criar um arquivo JSON para cada estado representado no arquivo Estados.json, e o seu conteúdo será um array das cidades pertencentes aquele estado, de acordo com o arquivo Cidades.json. O nome do arquivo deve ser o UF do estado, por exemplo: MG.json.'
);
createStateFiles();
console.log('Answer Question 1: Files created.');
console.log('');

console.log(
  '2. Criar um método que recebe como parâmetro o UF do estado, realize a leitura do arquivo JSON correspondente e retorne a quantidade de cidades daquele estado.'
);
console.log('Answer Question 2:');
showCitiesState();
console.log('');

console.log(
  '3. Criar um método que imprima no console um array com o UF dos cinco estados que mais possuem cidades, seguidos da quantidade, em ordem decrescente. Utilize o método criado no tópico anterior. Exemplo de impressão: [“UF - 93”, “UF - 82”, “UF - 74”, “UF - 72”, “UF - 65”].'
);
console.log('Answer Question 3:');
showStatesMoreCities(5);
console.log('');

console.log(
  '4. Criar um método que imprima no console um array com o UF dos cinco estados que menos possuem cidades, seguidos da quantidade, em ordem decrescente. Utilize o método criado no tópico anterior. Exemplo de impressão: [“UF - 30”, “UF - 27”, “UF - 25”, “UF - 23”, “UF - 21”].'
);
console.log('Answer Question 4:');
showStatesFewerCities(5);
console.log('');

console.log(
  '5. Criar um método que imprima no console um array com a cidade de maior nome de cada estado, seguida de seu UF. Em caso de empate, considerar a ordem alfabética para ordená-los e então retornar o primeiro. Por exemplo: [“Nome da Cidade – UF”, “Nome da Cidade – UF”, ...].'
);
console.log('Answer Question 5:');
dataStates.forEach((state) => {
  showStateCityLongerName(1, state);
});
console.log('');

console.log(
  '6. Criar um método que imprima no console um array com a cidade de menor nome de cada estado, seguida de seu UF. Em caso de empate, considerar a ordem alfabética para ordená-los e então retorne o primeiro. Por exemplo: [“Nome da Cidade – UF”, “Nome da Cidade – UF”, ...].'
);
console.log('Answer Question 6:');
dataStates.forEach((state) => {
  showStateCityShorterName(1, state);
});
console.log('');

console.log(
  '7. Criar um método que imprima no console a cidade de maior nome entre todos os estados, seguido do seu UF. Em caso de empate, considerar a ordem alfabética para ordená-los e então retornar o primeiro. Exemplo: “Nome da Cidade - UF".'
);
console.log('Answer Question 7:');
showStateCityLongerName(1, null);
console.log('');

console.log(
  '8. Criar um método que imprima no console a cidade de menor nome entre todos os estados, seguido do seu UF. Em caso de empate, considerar a ordem alfabética para ordená-los e então retornar o primeiro. Exemplo: “Nome da Cidade - UF".'
);
console.log('Answer Question 8:');
showStateCityShorterName(1, null);
console.log('');
