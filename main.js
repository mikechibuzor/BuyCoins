class PopulateData {
  constructor(data) {
    this.data = data.data;

    this.addImgUrl();
    this.userProfile();
    this.repoStructure();
  }

  // sets the user's image
  addImgUrl() {
    const imgElements = document.querySelectorAll(".pImg");
    [...imgElements].forEach((imgEl) => (imgEl.src = this.data.user.avatarUrl));
  }

  // sets the bio data information
  userProfile() {
    // const username = document.querySelector(".username");
    // const accountName = document.querySelector(".account-name");
    const bio = document.querySelector(".bio p");
    bio.textContent = this.data.user.bio;
  }

  // structures repo and further appends the repo
  repoStructure() {
    // selects repo container
    const ul = document.querySelector(".body ul");
    const { nodes } = this.data.user.repositories;

    nodes.forEach((node, index) => {
      const template = document.querySelector("#template");
      const templateBody = document.importNode(template.content, true);
      const languageArray = node.languages.nodes;
      const langContainer = templateBody.querySelector(".lguage");
      this.appendLanguages(langContainer, languageArray);
      templateBody.querySelector(".fork-count").textContent = node.forkCount;
      templateBody.querySelector(".description").textContent = node.description
        ? node.description
        : "";
      templateBody.querySelector(".name-of-repo").textContent =
        nodes[index].name;
      ul.append(templateBody);
    });
  }

  // helper function for the repo structure
  // it was later i realize that i only need to show the major language
  appendLanguages(langContainer, langArr) {
    langArr.forEach((lang) => {
      const spanEl = document.createElement("span");
      spanEl.innerHTML = `
              <em class="circle-language ${lang.name}"></em>${lang.name}
      `;
      langContainer.append(spanEl);
    });
  }
}

// I put this in an object because.. i think it's better there
const githubData = {
  token: "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",
  username: "mikechibuzor",
};

// GraphQL request body
const bodyy = {
  query: `query { 
  user(login: "mikechibuzor"){
    bio,
    avatarUrl,
    repositories(first: 20, orderBy: {field: CREATED_AT, direction: DESC}){
      nodes{
        name,
        description,
        forkCount,
        languages(first: 100){
          nodes{
            name
          }
        }
      }
    }
  }

}`,
};

// api url
const baseUrl = "https://api.github.com/graphql";

fetch(baseUrl, {
  method: "POST",
  mode: "cors",
  body: JSON.stringify(bodyy),
  headers: {
    "Content-Type": "application/json",
    Authorization: "bearer " + githubData.token,
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    new PopulateData(data);
  });

// handles hide and show of the user profile and username on the tab
window.addEventListener("scroll", function () {
  const docScrollTop = document.documentElement.scrollTop;
  const photoAgain = document.querySelector(".photo-again");
  if (docScrollTop > 200) {
    photoAgain.classList.remove("hide");
  } else {
    photoAgain.classList.add("hide");
  }
});
