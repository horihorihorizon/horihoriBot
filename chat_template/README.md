チャットテンプレートの使い方
=========
## 動作
「生産状況」の報告チャットの2行目に、テキストファイルに保存した任意のメッセージを送ることができます。  
メッセージを変更しても再起動する必要はありません。  

## 必要な設定
起動時の第5引数 "username" を設定する必要があります。  

## 使用法
horihoriBot/chat_template の中に chat_"username".txt というファイルを作ります。  
例：usernameがsteveなら chat_steve.txt  

txtファイルの1行目に任意のメッセージを記載します。  

txtファイルは「UTF-8、BOM無し」で保存してください。  
（メモ帳だとBOM有りなので注意）  
BOMがあると「ZWNBSP」マークがチャットに表示されます。  

## 使用しない時は
txtファイルの中身をすべて消すか、txtファイル自体を削除します。  