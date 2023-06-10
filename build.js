const fs = require("fs")

const data = require("./src/data.json")

const load_template = async (template_path, props) => {
    let template_html = eval("`" + (await fs.readFileSync(template_path)) + "`")
    return template_html
}

const for_loop = async (src_array, template_path) => {
    let output = ""

    for (let src of src_array)
    {
        output += await load_template(template_path, src)
        output += "\n"
    }

    return output
}

const build_index = async (site) => {
    let new_index_html = await load_template("public/index.html", { site })
    await fs.writeFileSync("build/index.html", new_index_html)
}

(async () => {
    let projects = await for_loop(data.projects, "src/project.html")
    let out = await load_template("src/directory.html", { projects })

    await build_index(out)
})()