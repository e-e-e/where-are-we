const data = require('../constants/data')

function stubFetch(win, api) {
  cy.stub(win, 'fetch')
    .withArgs('https://ipinfo.io/json')
    .resolves({ ok: true, json: () => api.ipInfoResponse })
    .withArgs(
      `https://native-land.ca/api/index.php?maps=territories&position=${api.ipInfoResponse.loc}`
    )
    .resolves({ ok: true, json: () => api.nativeLandsResponse })
}

describe('Where Are We - Popup', () => {
  describe('Helsinki', () => {
    beforeEach(() => {
      cy.visit('/', {
        onBeforeLoad(win) {
          stubFetch(win, data.helsinki)
        },
      })
      cy.server()
    })
    it('Shows a popup with no known indigenous territories', () => {
      cy.contains(
        'div',
        'Your IP indicates that you may be in Helsinki, Uusimaa, FI.'
      )
      cy.percySnapshot('Where we are (Helsinki)', { widths: [768, 992, 1200] })
    })
  })
  describe('Perth', () => {
    beforeEach(() => {
      cy.visit('/', {
        onBeforeLoad(win) {
          stubFetch(win, data.perth)
        },
      })
      cy.server()
    })
    it('Show a popup with a singular known indigenous territory', () => {
      cy.contains(
        'div',
        'Your IP indicates that you may be on Wajuk country, otherwise known as Perth, Western Australia, AU.'
      )
      cy.percySnapshot('Where we are (Perth)', { widths: [768, 992, 1200] })
    })
  })
  describe('Toronto', () => {
    beforeEach(() => {
      cy.visit('/', {
        onBeforeLoad(win) {
          stubFetch(win, data.toronto)
        },
      })
      cy.server()
    })
    it('Show a popup with multiple possible indigenous territories', () => {
      cy.contains(
        'div',
        'Your IP indicates that you may be on Ho-de-no-sau-nee-ga (Haudenosaunee), Anishinabewaki ᐊᓂᔑᓈᐯᐗᑭ, Mississaugas of the Credit First Nation, and/or Mississauga country, otherwise known as Toronto, Ontario, CA.'
      )
      cy.percySnapshot('Where we are (Toronto)', { widths: [768, 992, 1200] })
    })
  })
})
