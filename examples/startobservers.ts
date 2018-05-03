private initObservers() {
    const disposer = startObservers(null, "PostsReader.", [
      [
        "Loading",
        () => {
            this.loading = this.postsService.getPost(this.docId) != null
        }
      ],
      [
        "Data",
        () => {
            this.postData = this.postService.getPostAndAuthor(this.docId)
        }
      ]
    ]);
    addComponentDisposer(this, disposer);
}

