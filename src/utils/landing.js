/**
 * Inicializa o FAQ
 */
export function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-question")

  faqItems.forEach((item) => {
    item.addEventListener("click", () => {
      const parent = item.parentElement
      const answer = parent.querySelector(".faq-answer")

      // Toggle active state
      if (answer.style.maxHeight) {
        answer.style.maxHeight = null
        parent.classList.remove("active")
      } else {
        answer.style.maxHeight = answer.scrollHeight + "px"
        parent.classList.add("active")

        // Fechar outros itens
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherParent = otherItem.parentElement
            const otherAnswer = otherParent.querySelector(".faq-answer")
            otherAnswer.style.maxHeight = null
            otherParent.classList.remove("active")
          }
        })
      }
    })
  })
}

/**
 * Inicializa as tabs de preços
 */
export function initPricingTabs() {
  const pricingTabs = document.querySelectorAll(".pricing-tab")
  const pricingContents = document.querySelectorAll(".pricing-tab-content")

  pricingTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab")

      // Remover active de todas as tabs
      pricingTabs.forEach((t) => t.classList.remove("active"))

      // Adicionar active na tab clicada
      tab.classList.add("active")

      // Esconder todos os conteúdos
      pricingContents.forEach((content) => {
        content.classList.remove("active")
      })

      // Mostrar o conteúdo correspondente
      document.getElementById(`${tabId}-tab`)?.classList.add("active")
    })
  })
}

/**
 * Inicializa animações de scroll
 */
export function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el)
  })

  return observer
}
