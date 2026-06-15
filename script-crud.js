const btnAddTarefa = document.querySelector(".app__button--add-task");
const formAddTarefa = document.querySelector(".app__form-add-task");
const textTarefa = document.querySelector(".app__form-textarea");
const ulTarefas = document.querySelector(".app__section-task-list");
const btnCancelarForm = document.querySelector(".app__form-footer__button--cancel");
const descricaoTarefaEmAndamento = document.querySelector(".app__section-active-task-description");
const btnRemoverCompleta = document.querySelector("#btn-remover-concluidas");
const btnRemoverTodas = document.querySelector("#btn-remover-todas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let tarefaEmAndamento = null;
let itemTarefaSelecionada = null;

function atualizarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas, null, 2));
}

function criarElementoTarefa(tarefa) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("div");
  svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

  const p = document.createElement("p");
  p.classList.add("app__section-task-list-item-description");
  p.textContent = tarefa.descricao;

  const button = document.createElement("button");
  button.classList.add("app_button-edit");
  button.onclick = () => {
    const novaDescricao = prompt(
      "Digite a nova descrição da tarefa:",
      tarefa.descricao,
    );
    if (novaDescricao) {
      tarefa.descricao = novaDescricao;
      p.textContent = novaDescricao;
      atualizarTarefas();
    } else {
      alert("Descrição não alterada. A descrição da tarefa permanece a mesma.");
    }
  };
  const imgButton = document.createElement("img");
  imgButton.src = "./imagens/edit.png";
  button.appendChild(imgButton);
  li.appendChild(svg);
  li.appendChild(p);
  li.appendChild(button);

  if (tarefa.completa) {
    li.classList.add("app__section-task-list-item-complete");
    button.setAttribute("disabled", "disabled");
  } else {
    li.addEventListener("click", () => {
      descricaoTarefaEmAndamento.textContent = tarefa.descricao;
      const itensAtivos = document.querySelectorAll(
        ".app__section-task-list-item-active",
      );
      itensAtivos.forEach((item) =>
        item.classList.remove("app__section-task-list-item-active"),
      );
      if (tarefaEmAndamento === tarefa) {
        tarefaEmAndamento = null;
        itemTarefaSelecionada = null;
        li.classList.remove("app__section-task-list-item-active");
        descricaoTarefaEmAndamento.textContent = "";
        return;
      }
      tarefaEmAndamento = tarefa;
      itemTarefaSelecionada = li;
      li.classList.add("app__section-task-list-item-active");
    });
  }

  return li;
}

function limparForm() {
  formAddTarefa.classList.add("hidden");
  textTarefa.value = "";
}

btnAddTarefa.addEventListener("click", () => {
  formAddTarefa.classList.toggle("hidden");
});

btnCancelarForm.addEventListener("click", limparForm);

formAddTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const tarefa = {
    descricao: textTarefa.value,
  };
  tarefas.push(tarefa);
  localStorage.setItem("tarefas", JSON.stringify(tarefas, null, 2));

  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.appendChild(elementoTarefa);

  textTarefa.value = "";
  formAddTarefa.classList.add("hidden");
});

tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.appendChild(elementoTarefa);
});

document.addEventListener("focoFinalizado", () => {
  console.log("disparou");
  if (itemTarefaSelecionada && tarefaEmAndamento) {
    itemTarefaSelecionada.classList.add("app__section-task-list-item-complete");
    itemTarefaSelecionada.classList.remove(
      "app__section-task-list-item-active",
    );
    itemTarefaSelecionada
      .querySelector("button")
      .setAttribute("disabled", "disdisabledebled");
    tarefaEmAndamento.completa = true;
    atualizarTarefas();
    itemTarefaSelecionada = null;
    tarefaEmAndamento = null;
    descricaoTarefaEmAndamento.textContent = "";
  } else {
    alert(
      "Não havia nenhuma tarefa selecionada, selecione uma tarefa e comece o foco novamente",
    );
  }
});

const removerTarefasCompletas = (somenteCompletas) => {
  const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });
  tarefas = tarefas.filter((tarefa) => somenteCompletas ? !tarefa.completa : false);
  atualizarTarefas();
}

btnRemoverCompleta.onclick = () => removerTarefasCompletas(true);
btnRemoverTodas.onclick = () => removerTarefasCompletas(false);