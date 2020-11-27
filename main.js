

getWish();

function getWish() {
  fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      // console.log(data.length);

      data.forEach(element => {
        // console.log(element);
        const text = document.getElementById('text');
        fetch(`https://hacker-news.firebaseio.com/v0/item/${element}.json?print=pretty`)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            // console.log(data);
            // console.log(data.title);
            // console.log(data.url);

            const newData = document.createElement('div');
            newData.classList.add("wish-text");
            const h3 = document.createElement('h3');
            h3.textContent = data.title;
            const a = document.createElement('a');
            a.href = data.url;
            a.target = "_blank";
            a.textContent = "Look Up Here";
            newData.appendChild(h3);
            newData.appendChild(a);
            text.appendChild(newData);

          });

      });



    });
}




