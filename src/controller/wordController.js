import Word from "../models/Word";

export const home = async (req, res) => {
    let nowPage = parseInt(req.query.page || 1);

    let start = Math.floor(nowPage / 10) * 10;
    if (start === 0) {
        start = 1;
    }
    let end = Math.ceil(nowPage / 10) * 10;

    if (nowPage < 1) {
        return res.sendStatus(404);
    }

    try {
        const words = await Word.find({}).sort({ createdAt: "desc" }).limit(5).skip((nowPage - 1) * 5);
        // DB에 있는 모든 단어들을 홈화면에 보여줌
        const postCount = await Word.count();
        const lastPage = Math.ceil(postCount / 5);
        end = end > lastPage ? lastPage : end;

        return res.render("home", { pageTitle: "Home", words, start, end, nowPage });
    } catch {
        res.render("home", { pageTitle: "Home" });
    }
}

export const search = async (req, res) => {
    const { keyword } = req.query;
    let words = [];
    if (words) {
        words = await Word.find({
            title: {
                $regex: new RegExp(`^${keyword}`, "i"),
                // keyword로 시작하는 부분만 찾음
            }
        })
    }

    res.render("search", { pageTitle: "Search", words });
}

export const detail = async (req, res) => {
    const { id } = req.params;
    const words = await Word.findById(id);
    res.render("detail", { pageTitle: "Word Detail", words });
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const words = await Word.findById(id);

    res.render("edit", { pageTitle: `${words.title} Edit`, words });
}

export const postEdit = async (req, res) => {
    const { title, pronun, mean, example, from } = req.body;
    const { id } = req.params;

    const word = await Word.exists({ _id: id });

    if (!word) {
        res.status(404).redirect("/");
    }

    await Word.findByIdAndUpdate(id, {
        title,
        pronun,
        mean: mean.split(","),
        example,
        from,
    })
    return res.redirect(`/words/${id}`);

}

export const getUpload = (req, res) => {
    res.render("upload", { pageTitle: "Upload" });
}

export const postUpload = async (req, res) => {
    const { language, title, pronun, mean, example, from } = req.body;
    try {
        await Word.create({
            language,
            title,
            pronun,
            mean: mean.split(","),
            example,
            from,
        })

        return res.redirect("/");
    } catch (error) {
        console.log(error);
        res.render("upload", { pageTitle: "Upload", errorMessage: error._message });
    }
    res.redirect("/");
}

export const deleteWord = async (req, res) => {
    const { id } = req.params;
    await Word.findByIdAndDelete(id);
    res.redirect("/");
}


