# Effect Lab

写真にエフェクトをかけて遊ぶ実験場(8種類)。

## 写真の差し替え
1. `photos/` に写真を入れる(5〜10枚、横幅1500px前後・各500KB以下がおすすめ)
2. `index.html` の `PHOTOS` にパスを書く
   const PHOTOS = ['photos/01.jpg', 'photos/02.jpg'];

## ローカルで確認
ファイルを直接開かず、このフォルダで次を実行して http://localhost:8000 を開く。
    python -m http.server 8000

## 公開(GitHub Pages)
新しいリポジトリにこの中身を置き、Settings → Pages で公開する。
