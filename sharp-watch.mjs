import fs from "fs/promises"; //ファイル操作用ライブラリ
import path from "path"; //ファイルパス操作用ライブラリ
import sharp from "sharp"; //画像の処理や変換のためのライブラリ

async function processImage(inputPath) {
  const dirName = path.dirname(inputPath); //inputPath → 入れた画像までのファイルパス・path.dirname() →ファイル名を除いて抽出する
  const fileName = path.basename(inputPath); //ファイル名を取得する
  const outPutDir = `dist${dirName.replace("src", "")}`; //ディレクトリ名のファイルパスにsrcがあったら空文字にする
  const fileNameOnly = fileName.replace(/^(.+)\..+$/, "$1");
  // const breakpoints = [768, 1024];

  try {
    // ディレクトリがなければ作成
    await fs.mkdir("dist/assets/images", { recursive: true });

    // サブディレクトリがなければ作成
    // await fs.mkdir("dist/assets/images/webp", { recursive: true });

    const fileFormat = getExtension(fileName); //ファイルの拡張子を抽出（.jpeg　なら　jpeg　だけ）

    let sh = sharp(`${dirName}/${fileName}`);
    let webp = sharp(`${dirName}/${fileName}`);

    if (fileFormat === "jpg" || fileFormat === "jpeg") {
      sh = sh.jpeg({ quality: 90 });
      webp = webp.webp({ quality: 90, lossless: true });
    } else if (fileFormat === "png") {
      sh = sh.png({ quality: 90 });
      webp = webp.webp({ quality: 90, lossless: true });
    } else if (fileFormat === "gif") {
      sh = sh.gif({ quality: 90 });
      webp = webp.webp({ quality: 90, lossless: true });
    } else if (fileFormat === "svg") {
      await fs.copyFile(inputPath, `${outPutDir}/${fileName}`);
      console.log(`\u001b[1;32m ${fileName}を${outPutDir}に複製しました。`);
    } else {
      console.log("\u001b[1;31m 対応していないファイル形式です。");
      return;
    }

    // メイン画像の圧縮
    const [shInfo, webpInfo] = await Promise.all([
      sh.toFile(`${outPutDir}/${fileName}`),
      webp.toFile(
        `${outPutDir}/${fileName.replace(/\.[^/.]+$/, ".webp")}`
      ),
      // webp.toFile(`${outPutDir}/webp/${fileName}.webp`),
    ]);

    console.log(
      `\u001b[1;32m ${fileName}を圧縮しました。 ${shInfo.size / 1000}KB`
    );
    console.log(
      `\u001b[1;32m ${fileName}をwebpに変換しました。 ${webpInfo.size / 1000}KB`
    );

    // breakpoint の幅でリサイズ
    // for (const breakpoint of breakpoints) {
    //   if (shInfo.width > breakpoint) {
    //     const resizedImage = sharp(`${outPutDir}/${fileName}`)
    //       .resize(breakpoint)
    //       .toFile(`${outPutDir}/${fileNameOnly}_${breakpoint}.${fileFormat}`);
    //     console.log(
    //       `\u001b[1;32m ${fileName}を幅 ${breakpoint}px にリサイズしました.`
    //     );
    //     const resizedWebp = sharp(`${outPutDir}/${fileName}`)
    //       .resize(breakpoint)
    //       .toFile(`${outPutDir}/webp/${fileNameOnly}_${breakpoint}.webp`);
    //     console.log(
    //       `\u001b[1;32m ${fileName}を幅 ${breakpoint}px にリサイズし、WebPに変換しました.`
    //     );
    //   }
    // }
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`\u001b[1;31m ${err.message}`);
    } else {
      console.error(`\u001b[1;31m エラー: ${err}`);
    }
  }
}

// 拡張子を取得
function getExtension(file) {
  const ext = path.extname(file || "").split(".");
  return ext[ext.length - 1];
}

// コマンドライン引数の最初の引数を処理
if (process.argv.length < 3) {
  console.log("Usage: node sharp-watch.mjs <image_path>");
} else {
  processImage(process.argv[2]);
}
