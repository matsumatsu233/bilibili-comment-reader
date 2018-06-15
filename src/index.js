function getNewComments({comments, readComments}) {
  const readCommentsLength = readComments.length;

  let newCommentsIndex = comments.map(
      (comment, index, comments) =>
        comments.slice(index, index + readCommentsLength).join(';')
    ).lastIndexOf(readComments.join(';')
  ) + readCommentsLength;

  let newComments = comments.slice(newCommentsIndex);
  return {
    newComments,
    updatedReadComments: comments.slice(Math.max(newCommentsIndex + newComments.length - 5, 0), newCommentsIndex + newComments.length)
  }
}

function speechComments(...comments) {
  let utter = new SpeechSynthesisUtterance();
  utter.lang = "zh-CN";
  comments.forEach((comment) => {
    utter.text = comment;
    window.speechSynthesis.speak(utter);
  });
}

var intervalId;

if (intervalId) {
  clearInterval(intervalId);
  intervalId = null;
  console.log('阅读君已关闭!');
} else {
  console.log('阅读君已打开!');
  let isFirstTime = true;
  let readComments = [];

  function main(isFirstTime) {
    let comments = [...document.querySelectorAll('#chat-history-list .danmaku-content')].map(danmakuContentDiv => danmakuContentDiv.innerHTML);
    if (isFirstTime) {
      readComments.push(comments.slice(-5));
      isFirstTime = false;
    } else {
      let { newComments, updatedReadComments } = getNewComments({ comments, readComments });
      if (newComments.length > 0) {
        console.log(newComments);
        speechComments(newComments);
      }

      readComments = updatedReadComments;
    }
  }

  intervalId = window.setInterval(main, 1000);
}
