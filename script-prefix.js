const path = require("path")
const publicDir = path.resolve(__dirname, 'public')
const fs = require('fs-extra')

// 查找public下的文件
function findPublicIndexHtmlPath(root){
  const all = []
  const traverse = (root) => {
    if(!fs.existsSync(root)) return
    // 如果是目录，继续往下找
    let stat = fs.statSync(root)
    if(stat.isDirectory()){
      let dir = fs.readdirSync(root)
      dir.forEach(dirPath => {
        traverse(path.resolve(root, dirPath))
      })
    } else {
      let filename = path.basename(root, '.html')
      if(filename === 'index'){
        all.push(root)
      }
    }
  }
  traverse(root)
  return all
}

const PREFIX = `<!-- __PREFIX__ -->`
const TEMPLATE =  `<!-- __template__ -->`

const fileString = `
  <!-- __template__ -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            clifford: '#da373d',
          }
        }
      }
    }
  </script>
  <script src="https://cdn.staticfile.org/d3/7.8.2/d3.js"></script>
  <!-- __template__ -->
`

function resetTemplate(str = ''){
  if(str.split(TEMPLATE).length > 2){
    // 先还原
    str = str.replace(/(<!-- __template__ -->[\w\W]*<!-- __template__ -->)/g, PREFIX)
  }
  return str
}

function extralFile(){
  const allPath = findPublicIndexHtmlPath(publicDir)
  allPath.forEach(file => {
    const content = fs.readFileSync(file).toString()
    const resetContent = resetTemplate(content)
    fs.writeFileSync(file, resetContent)

    if(resetContent.indexOf(PREFIX) !== -1){
      // 不存在 script 脚本则插入固定
      let str = resetContent.replace(PREFIX, fileString)
      fs.writeFileSync(file, str)
    }
  })
}

module.exports = extralFile