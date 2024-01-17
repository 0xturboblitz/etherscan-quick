const config = {
  mainnet: {
    base: "https://etherscan.io/",
    weth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  },
  goerli: {
    base: "https://goerli.etherscan.io/",
    weth: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"
  },
  rinkeby: {
    base: "https://rinkeby.etherscan.io/",
    weth: "0xc778417e063141139fce010982780140aa0cd5ab"
  },
  optimism: {
    base: "https://optimistic.etherscan.io/",
  },
  arbitrum: {
    base: "https://arbiscan.io/",
  },
  bsc: {
    base: "https://bscscan.com/",
  },
  avalanche: {
    base: "https://snowtrace.io/",
  },
  gnosis: {
    base: "https://gnosisscan.io/",
  },
  polygon: {
    base: "https://polygonscan.com/",
  },
  zksync: {
    base: "https://zkscan.io/",
  },
  sepolia: {
    base: "https://sepolia.etherscan.io/",
  },
  fuji: {
    base: "https://testnet.snowtrace.io/",
  },
  mumbai: {
    base: "https://mumbai.polygonscan.com/",
  },
}

const ADDRESS_PATH = "address/"
const TOKEN_PATH = "token/"
const TRANSACTION_PATH = "tx/"

function resetDefaultSuggestion() {
  chrome.omnibox.setDefaultSuggestion({
    description: "Etherscan Quick",
  })
}

resetDefaultSuggestion()

chrome.omnibox.onInputCancelled.addListener(function () {
  resetDefaultSuggestion()
})

function parseInput(network, text) {
  console.log(network)
  if (text.length === 40 || text.length === 42) {
    navigate(`${network.base}${ADDRESS_PATH}${text}`)
  } else if (text.length === 66 || text.length === 64) {
    navigate(`${network.base}${TRANSACTION_PATH}${text}`)
  } else if (text === "weth") {
    navigate(`${network.base}${ADDRESS_PATH}${network.weth}`)
  } else if (text.startsWith("weth")) {
    const newText = text.replace("weth", "")
    navigate(
      `${network.base}${TOKEN_PATH}${network.weth}?a=${newText}`
    )
  } else {
    navigate(network.base)
  }
}

function sliceTestnetSelector(text) {
  return text.slice(1)
}

function navigate(url) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.update(tabs[0].id, { url: url })
  })
}

chrome.omnibox.onInputEntered.addListener(function (text) {
  if (text.endsWith(".eth")) {
    navigate(`${config.mainnet.base}enslookup-search?search=${text}`)
  } else if (text.charAt(0) === "r") {
    parseInput(config.rinkeby, sliceTestnetSelector(text))
  } else if (text.charAt(0) === "o") {
    parseInput(config.optimism, sliceTestnetSelector(text))
  } else if (text.charAt(0) === "g") {
    parseInput(config.goerli, sliceTestnetSelector(text))
  } else if (text.charAt(0) === "a") {
    parseInput(config.arbitrum, sliceTestnetSelector(text))
  } else if (text.charAt(0) === "b") {
    parseInput(config.bsc, sliceTestnetSelector(text))
  } else if (text.charAt(0) === "x") {
    parseInput(config.avalanche, sliceTestnetSelector(text))
  } else if (text.charAt(0) === "n") {
    parseInput(config.gnosis, sliceTestnetSelector(text))
  } else if (text.charAt(0) === "p") {
    parseInput(config.polygon, sliceTestnetSelector(text))
  } else if (text.charAt(0) === "z") {
    parseInput(config.zksync, sliceTestnetSelector(text))
  } else if (text.charAt(0) === "s") {
    parseInput(config.sepolia, sliceTestnetSelector(text))
  } else if (text.charAt(0) === "f") {
    parseInput(config.fuji, sliceTestnetSelector(text))
  } else if (text.charAt(0) === "m") {
    parseInput(config.mumbai, sliceTestnetSelector(text))
  } else {
    parseInput(config.mainnet, text)
  }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  fetch(request.input, request.init).then(
    function (response) {
      return response.text().then(function (text) {
        sendResponse([
          {
            body: text,
            status: response.status,
            statusText: response.statusText,
          },
          null,
        ])
      })
    },
    function (error) {
      sendResponse([null, error])
    }
  )
  return true
})
