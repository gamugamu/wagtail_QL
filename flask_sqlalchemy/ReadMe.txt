query pma {
  allPmaHome {
    title
    caption
    id
    dateStart
    dateEnd
  }
}

mutation createGallery {
  mutatePmaGallery(user: {name: "user", password: "password"}, pmaData: {title: "new pma from js", caption: "lobulous", gallery: [{title: "Deux titre"}]}) {
    pma {
      title
      caption
      gallery {
        title
        caption
      }
    }
  }
}

mutation createPmaHome {
  mutatePmaHome(user: {name: "uer", password: "password"}, pmaData: {title: "new pma", caption: "lobulous"}) {
    pma {
      title
      caption
    }
  }
}

mutation createUser {
  createUser(user: {name: "user", password: "password"}) {
    user {
      name
    }
  }
}
