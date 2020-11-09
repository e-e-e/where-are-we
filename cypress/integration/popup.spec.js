describe('Where Are We - Popup', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'fetch')
          .withArgs('https://ipinfo.io/json')
          .resolves({
            ok: true,
            json: () => ({
              ip: '80.220.207.52',
              hostname: 'dsl-hkibng11-50dccf-52.dhcp.inet.fi',
              city: 'Helsinki',
              region: 'Uusimaa',
              country: 'FI',
              loc: '60.1695,24.9354',
              org: 'AS1759 Telia Finland Oyj',
              postal: '00100',
              timezone: 'Europe/Helsinki',
              readme: 'https://ipinfo.io/missingauth'
            })
          })
          .withArgs(
            'https://native-land.ca/api/index.php?maps=territories&position=60.1695,24.9354'
          )
          .resolves({
            ok: true,
            json: () => []
          })
      }
    })
    cy.server()
  })

  it('works', () => {
    cy.contains(
      'div',
      'Your IP indicates that you may be in Helsinki, Uusimaa, FI.'
    )
  })
})
