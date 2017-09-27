const fs = require("fs");
const prettier = require("prettier");

const prettierConfig = {
  tabWidth: 4,
  useTabs: false,
  singleQuote: false,
  bracketSpacing: true,
  parser: "typescript"
};

function readMd(md) {
  const txt = fs.readFileSync(`./emojis/${md}.md`);
  const records = txt.toString().split("\n");

  // "😀 | `:grinning:` | GRINNING FACE"

  const code = [];
  code.push(`const ${md} =[`);

  records.forEach((record, index) => {
    if (index < 2) {
      return;
    }
    const fields = record.split("|");
    const emoji = fields[0].trim();
    const alias = fields[1].replace(/`/g, "").trim();
    const name = fields[2].trim();
    code.push(`{emoji: "${emoji}",alias:"${alias}",name:"${name}"},`);
  });

  code.push("]");

  code.push(`\r\n\r\nexport default ${md}`);

  fs.writeFileSync(
    `./refs/${md}.ts`,
    prettier.format(code.join(""), prettierConfig)
  );
}

const mds = [
  "people",
  "activity",
  "flags",
  "foods",
  "nature",
  "objects",
  "places",
  "symbols"
];

mds.forEach(readMd);

const indexCode = [];
mds.forEach(function(md) {
  indexCode.push(`import ${md} from "./${md}";\r\n`);
});

indexCode.push("\r\n\r\nexport default {");
mds.forEach(function(md) {
  indexCode.push(`${md},`);
});
indexCode.push("}");

fs.writeFileSync(
  `./refs/index.ts`,
  prettier.format(indexCode.join(""), prettierConfig)
);
