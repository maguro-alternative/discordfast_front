import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    //root: './',
    server: {
        open: true, // 自動でブラウザを開く
        port: 3000, // ポート番号
        host: true, // ネットワーク上のIPアドレスを表示
    },
    build: {
        outDir: 'dist', // ビルドの出力先ディレクトリ
        //sourcemap: false, // ソースマップの出力
    },
    publicDir: 'public', // 静的ファイルのディレクトリ
    plugins: [react()],
});