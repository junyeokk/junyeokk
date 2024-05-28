import { readFileSync, writeFileSync } from "node:fs";
import Parser from "rss-parser";

// 기존 README.md 파일 읽기
const readmePath = "README.md";
let readmeContent = readFileSync(readmePath, "utf8");

// RSS 파서 생성
const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});

// 최신 블로그 포스트 추가하는 함수
(async () => {
  // RSS 피드 가져오기
  const feed = await parser.parseURL("https://laurent.tistory.com/rss");

  // 최신 5개의 글의 제목과 링크를 추가할 텍스트 생성
  let latestPosts = "### Latest Blog Posts\n\n";
  feed.items.slice(0, 5).forEach(({ title, link }) => {
    latestPosts += `- [${title}](${link})\n`;
  });

  // 기존 README.md에 최신 블로그 포스트 추가
  const newReadmeContent = readmeContent.includes("## Latest Blog Posts")
    ? readmeContent.replace(
        /### Latest Blog Posts[\s\S]*?(?=\n\n## |\n$)/,
        latestPosts
      )
    : readmeContent + latestPosts;

  const message =
    newReadmeContent !== readmeContent
      ? (writeFileSync(readmePath, newReadmeContent, "utf8"),
        "README.md 업데이트 완료")
      : "새로운 블로그 포스트가 없습니다. README.md 파일이 업데이트되지 않았습니다.";

  console.log(message);
})();
