(() => {
    "use strict";
    const modules_flsModules = {};
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    function setHash(hash) {
        hash = hash ? `#${hash}` : window.location.href.split("#")[0];
        history.pushState("", "", hash);
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function tabs() {
        const tabs = document.querySelectorAll("[data-tabs]");
        let tabsActiveHash = [];
        if (tabs.length > 0) {
            const hash = getHash();
            if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
            tabs.forEach(((tabsBlock, index) => {
                tabsBlock.classList.add("_tab-init");
                tabsBlock.setAttribute("data-tabs-index", index);
                tabsBlock.addEventListener("click", setTabsAction);
                initTabs(tabsBlock);
            }));
            let mdQueriesArray = dataMediaQueries(tabs, "tabs");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
        }
        function setTitlePosition(tabsMediaArray, matchMedia) {
            tabsMediaArray.forEach((tabsMediaItem => {
                tabsMediaItem = tabsMediaItem.item;
                let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
                let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
                let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
                let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
                tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems.forEach(((tabsContentItem, index) => {
                    if (matchMedia.matches) {
                        tabsContent.append(tabsTitleItems[index]);
                        tabsContent.append(tabsContentItem);
                        tabsMediaItem.classList.add("_tab-spoller");
                    } else {
                        tabsTitles.append(tabsTitleItems[index]);
                        tabsMediaItem.classList.remove("_tab-spoller");
                    }
                }));
            }));
        }
        function initTabs(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
            if (tabsActiveHashBlock) {
                const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
                tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
            }
            if (tabsContent.length) tabsContent.forEach(((tabsContentItem, index) => {
                tabsTitles[index].setAttribute("data-tabs-title", "");
                tabsContentItem.setAttribute("data-tabs-item", "");
                if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
            }));
        }
        function setTabsStatus(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            function isTabsAnamate(tabsBlock) {
                if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
            }
            const tabsBlockAnimate = isTabsAnamate(tabsBlock);
            if (tabsContent.length > 0) {
                const isHash = tabsBlock.hasAttribute("data-tabs-hash");
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    if (tabsTitles[index].classList.contains("_tab-active")) {
                        if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                        if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                    } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
                }));
            }
        }
        function setTabsAction(e) {
            const el = e.target;
            if (el.closest("[data-tabs-title]")) {
                const tabTitle = el.closest("[data-tabs-title]");
                const tabsBlock = tabTitle.closest("[data-tabs]");
                if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                    let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                    tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                    tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                    tabTitle.classList.add("_tab-active");
                    setTabsStatus(tabsBlock);
                }
                e.preventDefault();
            }
        }
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: false,
                    goHash: false
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    class SelectConstructor {
        constructor(props, data = null) {
            let defaultConfig = {
                init: true,
                logging: true,
                speed: 150
            };
            this.config = Object.assign(defaultConfig, props);
            this.selectClasses = {
                classSelect: "select",
                classSelectBody: "select__body",
                classSelectTitle: "select__title",
                classSelectValue: "select__value",
                classSelectLabel: "select__label",
                classSelectInput: "select__input",
                classSelectText: "select__text",
                classSelectLink: "select__link",
                classSelectOptions: "select__options",
                classSelectOptionsScroll: "select__scroll",
                classSelectOption: "select__option",
                classSelectContent: "select__content",
                classSelectRow: "select__row",
                classSelectData: "select__asset",
                classSelectDisabled: "_select-disabled",
                classSelectTag: "_select-tag",
                classSelectOpen: "_select-open",
                classSelectActive: "_select-active",
                classSelectFocus: "_select-focus",
                classSelectMultiple: "_select-multiple",
                classSelectCheckBox: "_select-checkbox",
                classSelectOptionSelected: "_select-selected",
                classSelectPseudoLabel: "_select-pseudo-label"
            };
            this._this = this;
            if (this.config.init) {
                const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select");
                if (selectItems.length) {
                    this.selectsInit(selectItems);
                    this.setLogging(`Прокинувся, построїв селектов: (${selectItems.length})`);
                } else this.setLogging("Сплю, немає жодного select");
            }
        }
        getSelectClass(className) {
            return `.${className}`;
        }
        getSelectElement(selectItem, className) {
            return {
                originalSelect: selectItem.querySelector("select"),
                selectElement: selectItem.querySelector(this.getSelectClass(className))
            };
        }
        selectsInit(selectItems) {
            selectItems.forEach(((originalSelect, index) => {
                this.selectInit(originalSelect, index + 1);
            }));
            document.addEventListener("click", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusin", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusout", function(e) {
                this.selectsActions(e);
            }.bind(this));
        }
        selectInit(originalSelect, index) {
            const _this = this;
            let selectItem = document.createElement("div");
            selectItem.classList.add(this.selectClasses.classSelect);
            originalSelect.parentNode.insertBefore(selectItem, originalSelect);
            selectItem.appendChild(originalSelect);
            originalSelect.hidden = true;
            index ? originalSelect.dataset.id = index : null;
            if (this.getSelectPlaceholder(originalSelect)) {
                originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
                if (this.getSelectPlaceholder(originalSelect).label.show) {
                    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
                    selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
                }
            }
            selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
            this.selectBuild(originalSelect);
            originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
            this.config.speed = +originalSelect.dataset.speed;
            originalSelect.addEventListener("change", (function(e) {
                _this.selectChange(e);
            }));
        }
        selectBuild(originalSelect) {
            const selectItem = originalSelect.parentElement;
            selectItem.dataset.id = originalSelect.dataset.id;
            originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
            originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
            originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setOptions(selectItem, originalSelect);
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
            originalSelect.hasAttribute("data-open") ? this.selectAction(selectItem) : null;
            this.selectDisabled(selectItem, originalSelect);
        }
        selectsActions(e) {
            const targetElement = e.target;
            const targetType = e.type;
            if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                const selectItem = targetElement.closest(".select") ? targetElement.closest(".select") : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
                const originalSelect = this.getSelectElement(selectItem).originalSelect;
                if (targetType === "click") {
                    if (!originalSelect.disabled) if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                        const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
                        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
                        this.optionAction(selectItem, originalSelect, optionItem);
                    } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) this.selectAction(selectItem); else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
                        const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
                        this.optionAction(selectItem, originalSelect, optionItem);
                    }
                } else if (targetType === "focusin" || targetType === "focusout") {
                    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) targetType === "focusin" ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
                } else if (targetType === "keydown" && e.code === "Escape") this.selectsСlose();
            } else this.selectsСlose();
        }
        selectsСlose(selectOneGroup) {
            const selectsGroup = selectOneGroup ? selectOneGroup : document;
            const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
            if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem => {
                this.selectСlose(selectActiveItem);
            }));
        }
        selectСlose(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.remove(this.selectClasses.classSelectOpen);
                _slideUp(selectOptions, originalSelect.dataset.speed);
                setTimeout((() => {
                    selectItem.style.zIndex = "";
                }), originalSelect.dataset.speed);
            }
        }
        selectAction(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOpenzIndex = originalSelect.dataset.zIndex ? originalSelect.dataset.zIndex : 3;
            this.setOptionsPosition(selectItem);
            if (originalSelect.closest("[data-one-select]")) {
                const selectOneGroup = originalSelect.closest("[data-one-select]");
                this.selectsСlose(selectOneGroup);
            }
            setTimeout((() => {
                if (!selectOptions.classList.contains("_slide")) {
                    selectItem.classList.toggle(this.selectClasses.classSelectOpen);
                    _slideToggle(selectOptions, originalSelect.dataset.speed);
                    if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) selectItem.style.zIndex = selectOpenzIndex; else setTimeout((() => {
                        selectItem.style.zIndex = "";
                    }), originalSelect.dataset.speed);
                }
            }), 0);
        }
        setSelectTitleValue(selectItem, originalSelect) {
            const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
            const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
            if (selectItemTitle) selectItemTitle.remove();
            selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
        }
        getSelectTitleValue(selectItem, originalSelect) {
            let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
            if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
                selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`)).join("");
                if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
                    document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
                    if (originalSelect.hasAttribute("data-search")) selectTitleValue = false;
                }
            }
            selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : "";
            let pseudoAttribute = "";
            let pseudoAttributeClass = "";
            if (originalSelect.hasAttribute("data-pseudo-label")) {
                pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
                pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
            }
            this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
            if (originalSelect.hasAttribute("data-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`; else {
                const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
                return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
            }
        }
        getSelectElementContent(selectOption) {
            const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : "";
            const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
            let selectOptionContentHTML = ``;
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
            selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
            selectOptionContentHTML += selectOption.textContent;
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            return selectOptionContentHTML;
        }
        getSelectPlaceholder(originalSelect) {
            const selectPlaceholder = Array.from(originalSelect.options).find((option => !option.value));
            if (selectPlaceholder) return {
                value: selectPlaceholder.textContent,
                show: selectPlaceholder.hasAttribute("data-show"),
                label: {
                    show: selectPlaceholder.hasAttribute("data-label"),
                    text: selectPlaceholder.dataset.label
                }
            };
        }
        getSelectedOptionsData(originalSelect, type) {
            let selectedOptions = [];
            if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option => option.value)).filter((option => option.selected)); else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
            return {
                elements: selectedOptions.map((option => option)),
                values: selectedOptions.filter((option => option.value)).map((option => option.value)),
                html: selectedOptions.map((option => this.getSelectElementContent(option)))
            };
        }
        getOptions(originalSelect) {
            const selectOptionsScroll = originalSelect.hasAttribute("data-scroll") ? `data-simplebar` : "";
            const customMaxHeightValue = +originalSelect.dataset.scroll ? +originalSelect.dataset.scroll : null;
            let selectOptions = Array.from(originalSelect.options);
            if (selectOptions.length > 0) {
                let selectOptionsHTML = ``;
                if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option => option.value));
                selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ""} class="${this.selectClasses.classSelectOptionsScroll}">`;
                selectOptions.forEach((selectOption => {
                    selectOptionsHTML += this.getOption(selectOption, originalSelect);
                }));
                selectOptionsHTML += `</div>`;
                return selectOptionsHTML;
            }
        }
        getOption(selectOption, originalSelect) {
            const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
            const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? `hidden` : ``;
            const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : "";
            const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
            const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank") ? `target="_blank"` : "";
            let selectOptionHTML = ``;
            selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
            selectOptionHTML += this.getSelectElementContent(selectOption);
            selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
            return selectOptionHTML;
        }
        setOptions(selectItem, originalSelect) {
            const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            selectItemOptions.innerHTML = this.getOptions(originalSelect);
        }
        setOptionsPosition(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
            const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
            const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;
            if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
                selectOptions.hidden = false;
                const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue("max-height"));
                const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
                const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
                selectOptions.hidden = true;
                const selectItemHeight = selectItem.offsetHeight;
                const selectItemPos = selectItem.getBoundingClientRect().top;
                const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
                const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);
                if (selectItemResult < 0) {
                    const newMaxHeightValue = selectOptionsHeight + selectItemResult;
                    if (newMaxHeightValue < 100) {
                        selectItem.classList.add("select--show-top");
                        selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
                    } else {
                        selectItem.classList.remove("select--show-top");
                        selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
                    }
                }
            } else setTimeout((() => {
                selectItem.classList.remove("select--show-top");
                selectItemScroll.style.maxHeight = customMaxHeightValue;
            }), +originalSelect.dataset.speed);
        }
        optionAction(selectItem, originalSelect, optionItem) {
            const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
            if (!selectOptions.classList.contains("_slide")) {
                if (originalSelect.multiple) {
                    optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
                    const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
                    originalSelectSelectedItems.forEach((originalSelectSelectedItem => {
                        originalSelectSelectedItem.removeAttribute("selected");
                    }));
                    const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
                    selectSelectedItems.forEach((selectSelectedItems => {
                        originalSelect.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`).setAttribute("selected", "selected");
                    }));
                } else {
                    if (!originalSelect.hasAttribute("data-show-selected")) setTimeout((() => {
                        if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
                        optionItem.hidden = true;
                    }), this.config.speed);
                    originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
                    this.selectAction(selectItem);
                }
                this.setSelectTitleValue(selectItem, originalSelect);
                this.setSelectChange(originalSelect);
            }
        }
        selectChange(e) {
            const originalSelect = e.target;
            this.selectBuild(originalSelect);
            this.setSelectChange(originalSelect);
        }
        setSelectChange(originalSelect) {
            if (originalSelect.hasAttribute("data-validate")) formValidate.validateInput(originalSelect);
            if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
                let tempButton = document.createElement("button");
                tempButton.type = "submit";
                originalSelect.closest("form").append(tempButton);
                tempButton.click();
                tempButton.remove();
            }
            const selectItem = originalSelect.parentElement;
            this.selectCallback(selectItem, originalSelect);
        }
        selectDisabled(selectItem, originalSelect) {
            if (originalSelect.disabled) {
                selectItem.classList.add(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
            } else {
                selectItem.classList.remove(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
            }
        }
        searchActions(selectItem) {
            this.getSelectElement(selectItem).originalSelect;
            const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
            const _this = this;
            selectInput.addEventListener("input", (function() {
                selectOptionsItems.forEach((selectOptionsItem => {
                    if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) selectOptionsItem.hidden = false; else selectOptionsItem.hidden = true;
                }));
                selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
            }));
        }
        selectCallback(selectItem, originalSelect) {
            document.dispatchEvent(new CustomEvent("selectCallback", {
                detail: {
                    select: originalSelect
                }
            }));
        }
        setLogging(message) {
            this.config.logging ? functions_FLS(`[select]: ${message} `) : null;
        }
    }
    modules_flsModules.select = new SelectConstructor({});
    const BtnDeleteApiManager = document.getElementById("btn-delete-settings");
    const BtnAddApiManager = document.getElementById("btn-add-settigs");
    if (BtnDeleteApiManager) BtnDeleteApiManager.addEventListener("click", (function(e) {
        e.preventDefault();
    }));
    if (BtnAddApiManager) BtnAddApiManager.addEventListener("click", (function(e) {
        e.preventDefault();
    }));
    const FeatureBlockHide = document.getElementById("features-block__switch");
    if (FeatureBlockHide) FeatureBlockHide.addEventListener("click", (function(e) {
        this.classList.toggle("active");
        const FeatureBlockList = document.getElementById("features-block__list");
        FeatureBlockList.classList.toggle("active");
    }));
    const FormsSourcePage = document.querySelectorAll(".form-sources");
    if (FormsSourcePage) FormsSourcePage.forEach((function(item) {
        item.addEventListener("submit", (function(e) {
            e.preventDefault();
        }));
    }));
    const turnedSound = document.getElementById("turned-sound");
    if (turnedSound) turnedSound.addEventListener("click", (function(e) {
        this.classList.toggle("active");
    }));
    const turnedMode = document.getElementById("turned-mode");
    if (turnedMode) turnedMode.addEventListener("click", (function(e) {
        this.classList.toggle("active");
    }));
    let boxes = document.getElementsByName("incoming-news");
    if (boxes) {
        boxes.forEach((b => b.addEventListener("change", tick)));
        function tick(e) {
            let state = e.target.checked;
            boxes.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let tradeAudioCheckbox = document.getElementsByName("trade-audio");
    if (tradeAudioCheckbox) {
        tradeAudioCheckbox.forEach((b => b.addEventListener("change", Tradetick)));
        function Tradetick(e) {
            let state = e.target.checked;
            tradeAudioCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let treeNewsCheckbox = document.getElementsByName("treeNews");
    if (treeNewsCheckbox) {
        treeNewsCheckbox.forEach((b => b.addEventListener("change", treeNewstick)));
        function treeNewstick(e) {
            let state = e.target.checked;
            treeNewsCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let OrderFilledCheckbox = document.getElementsByName("filled");
    if (OrderFilledCheckbox) {
        OrderFilledCheckbox.forEach((b => b.addEventListener("change", OrderFilledtick)));
        function OrderFilledtick(e) {
            let state = e.target.checked;
            OrderFilledCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let phoenixNewsCheckbox = document.getElementsByName("phoenixNews");
    if (phoenixNewsCheckbox) {
        phoenixNewsCheckbox.forEach((b => b.addEventListener("change", phoenixNewstick)));
        function phoenixNewstick(e) {
            let state = e.target.checked;
            phoenixNewsCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let sellFilledCheckbox = document.getElementsByName("sellFilled");
    if (sellFilledCheckbox) {
        sellFilledCheckbox.forEach((b => b.addEventListener("change", sellFilledtick)));
        function sellFilledtick(e) {
            let state = e.target.checked;
            sellFilledCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    const keyBindsForm = document.querySelectorAll(".key-binds-content form");
    if (keyBindsForm) keyBindsForm.forEach((function(item) {
        item.addEventListener("submit", (function(e) {
            e.preventDefault();
        }));
    }));
    let sizePresetsCheckbox = document.getElementsByName("size-presets");
    if (sizePresetsCheckbox) {
        sizePresetsCheckbox.forEach((b => b.addEventListener("change", sizePresetstick)));
        function sizePresetstick(e) {
            let state = e.target.checked;
            sizePresetsCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let standardPresetsCheckbox = document.getElementsByName("standard-presets");
    if (standardPresetsCheckbox) {
        standardPresetsCheckbox.forEach((b => b.addEventListener("change", standardPresetstick)));
        function standardPresetstick(e) {
            let state = e.target.checked;
            standardPresetsCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let leverageCheckbox = document.getElementsByName("leverage-checkbox");
    if (leverageCheckbox) {
        leverageCheckbox.forEach((b => b.addEventListener("change", leveragetick)));
        function leveragetick(e) {
            let state = e.target.checked;
            leverageCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let slippageCheckbox = document.getElementsByName("slippage-checkbox");
    if (slippageCheckbox) {
        slippageCheckbox.forEach((b => b.addEventListener("change", slippagetick)));
        function slippagetick(e) {
            let state = e.target.checked;
            slippageCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let detectorCheckbox = document.getElementsByName("detector-checkbox");
    if (detectorCheckbox) {
        detectorCheckbox.forEach((b => b.addEventListener("change", detectortick)));
        function detectortick(e) {
            let state = e.target.checked;
            detectorCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let sameNewsCheckbox = document.getElementsByName("same-news");
    if (sameNewsCheckbox) {
        sameNewsCheckbox.forEach((b => b.addEventListener("change", sameNewstick)));
        function sameNewstick(e) {
            let state = e.target.checked;
            sameNewsCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let hideShowCheckbox = document.getElementsByName("hide-show");
    if (hideShowCheckbox) {
        hideShowCheckbox.forEach((b => b.addEventListener("change", hideShowtick)));
        function hideShowtick(e) {
            let state = e.target.checked;
            hideShowCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
        }
    }
    let inputLeverage = document.getElementById("leverage-input");
    let spanLeverage = document.getElementById("leverage__volume");
    if (inputLeverage) inputLeverage.addEventListener("input", (function() {
        spanLeverage.textContent = this.value;
    }));
    let inputSlippage = document.getElementById("slippage-input");
    let spanSlippage = document.getElementById("slippage__volume");
    if (inputLeverage) inputSlippage.addEventListener("input", (function() {
        spanSlippage.textContent = this.value;
    }));
    const Terminal = document.getElementById("grid-terminal");
    if (Terminal) {
        const turnedBTN = document.getElementById("turned");
        let gridItems = document.querySelectorAll(".grid-item");
        document.getElementById("item-news-height");
        document.querySelector(".wrapper").offsetHeight;
        document.querySelector(".wrapper");
        if (turnedBTN) turnedBTN.addEventListener("click", (function(e) {
            this.classList.toggle("active");
            if (this.classList.contains("active")) gridItems.forEach((function(item) {
                item.classList.add("active");
            })); else gridItems.forEach((function(item) {
                item.classList.remove("active");
            }));
        }));
        new DataTable("#table-symbol-search", {
            responsive: true,
            searching: true,
            ordering: true,
            paging: false,
            info: false,
            language: {
                searchPlaceholder: "Enter Ticker",
                search: ""
            }
        });
    }
    const PositionViewLimit = document.getElementById("limit-view-position");
    const PositionViewMarket = document.getElementById("market-view-position");
    const PositionViewInput = document.querySelectorAll(".position-enter-price");
    if (PositionViewLimit && PositionViewMarket) {
        PositionViewLimit.addEventListener("click", (function() {
            PositionViewLimit.classList.add("active");
            PositionViewMarket.classList.remove("active");
            PositionViewInput.forEach((function(item) {
                let childInput = item.querySelector(".enter-price-view");
                item.style.borderLeft = "1px solid #555e6e";
                childInput.style.opacity = 1;
                childInput.style.pointerEvents = "initial";
            }));
        }));
        PositionViewMarket.addEventListener("click", (function() {
            PositionViewMarket.classList.add("active");
            PositionViewLimit.classList.remove("active");
            PositionViewInput.forEach((function(item) {
                let childInput = item.querySelector(".enter-price-view");
                item.style.border = "1px solid transparent";
                childInput.style.opacity = 0;
                childInput.style.pointerEvents = "none";
            }));
        }));
    }
    let TPSLCheckbox = document.getElementsByName("tp-sl-checkbox");
    if (TPSLCheckbox) {
        TPSLCheckbox.forEach((b => b.addEventListener("change", TPSLtick)));
        let inputTPPrice = document.getElementById("limit-result-tp-price");
        let inputQuantity = document.getElementById("limit-result-tp-quantity");
        function TPSLtick(e) {
            let state = e.target.checked;
            TPSLCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
            if (e.target.checked === false) {
                inputTPPrice.style.opacity = 0;
                inputQuantity.style.opacity = 0;
            } else {
                inputTPPrice.style.opacity = 1;
                inputQuantity.style.opacity = 1;
            }
        }
    }
    let MarketTPSLCheckbox = document.getElementsByName("market-tp-sl-checkbox");
    if (MarketTPSLCheckbox) {
        MarketTPSLCheckbox.forEach((b => b.addEventListener("change", MarketTPSLtick)));
        let inputTPPriceMarket = document.getElementById("market-tp-price");
        let inputQuantityMerket = document.getElementById("market-tp-ouantity");
        function MarketTPSLtick(e) {
            let state = e.target.checked;
            MarketTPSLCheckbox.forEach((b => b.checked = false));
            e.target.checked = state;
            if (e.target.checked === false) {
                inputTPPriceMarket.style.opacity = 0;
                inputQuantityMerket.style.opacity = 0;
            } else {
                inputTPPriceMarket.style.opacity = 1;
                inputQuantityMerket.style.opacity = 1;
            }
        }
    }
    let btnNewsTab = document.getElementById("btn-news-tab");
    if (btnNewsTab) btnNewsTab.addEventListener("click", (function() {
        let openWindow = 1;
        if (openWindow > 0) {
            let newWinNews = window.open("", "", "width=420,height=500");
            let cloneContentNews = $("#item-news-feed").clone();
            let cloneHead = $("head").clone();
            let createDiv = document.createElement("div");
            createDiv.appendChild(cloneHead[0]);
            createDiv.appendChild(cloneContentNews[0]);
            newWinNews.document.body.style.overflowY = "hidden";
            newWinNews.document.body.appendChild(createDiv);
            setTimeout((function() {
                let AllScript = document.querySelectorAll("script");
                AllScript.forEach((function(script, index) {
                    let newScript = document.createElement("script");
                    newScript.src = script.src;
                    newWinNews.document.body.appendChild(newScript);
                }));
            }), 0);
        }
    }));
    let positionBtnTab = document.getElementById("position-btn-tab");
    if (btnNewsTab) positionBtnTab.addEventListener("click", (function() {
        let openWindow = 1;
        if (openWindow > 0) {
            let newWinPosition = window.open("", "", "width=1180,height=500");
            let cloneContentPosition = $("#position-tab-content").clone();
            let clonePopupPosition = $("#popup-share").clone();
            let cloneHead = $("head").clone();
            let createDiv = document.createElement("div");
            createDiv.classList.add("wrapper");
            createDiv.appendChild(cloneHead[0]);
            createDiv.appendChild(cloneContentPosition[0]);
            newWinPosition.document.body.style.overflowY = "hidden";
            newWinPosition.document.body.appendChild(createDiv);
            newWinPosition.document.body.appendChild(clonePopupPosition[0]);
            setTimeout((function() {
                let AllScript = document.querySelectorAll("script");
                AllScript.forEach((function(script, index) {
                    let newScript = document.createElement("script");
                    newScript.src = script.src;
                    newWinPosition.document.body.appendChild(newScript);
                }));
            }), 0);
        }
    }));
    let btnBTCUSDTTab = document.getElementById("BTCUSDT-item-btn");
    if (btnBTCUSDTTab) btnBTCUSDTTab.addEventListener("click", (function() {
        let newWin = window.open("", "", "left=50%, width=1000,height=100");
        let cloneContent = $("#BTCUSDT-item").clone();
        let cloneHead = $("head").clone();
        let createDiv = document.createElement("div");
        createDiv.appendChild(cloneHead[0]);
        createDiv.appendChild(cloneContent[0]);
        newWin.document.body.appendChild(createDiv);
        setTimeout((function() {
            let AllScript = document.querySelectorAll("script");
            AllScript.forEach((function(script, index) {
                let newScript = document.createElement("script");
                newScript.src = script.src;
                newWin.document.body.appendChild(newScript);
            }));
        }), 0);
    }));
    let tradeBTNBtc = document.getElementById("trade-btn-btc");
    if (tradeBTNBtc) tradeBTNBtc.addEventListener("click", (function() {
        let newWinTrade = window.open("", "", "left=100%, width=700,height=600");
        let cloneContent = $("#trade-BTCUSDT-item").clone();
        let cloneHead = $("head").clone();
        let clonePopup = $("#popup-isolated-cross").clone();
        let createDiv = document.createElement("div");
        createDiv.classList.add("wrapper");
        createDiv.appendChild(cloneContent[0]);
        newWinTrade.document.head.appendChild(cloneHead[0]);
        newWinTrade.document.body.appendChild(createDiv);
        newWinTrade.document.body.appendChild(clonePopup[0]);
        setTimeout((function() {
            let AllScript = document.querySelectorAll("script");
            AllScript.forEach((function(script, index) {
                let newScript = document.createElement("script");
                newScript.src = script.src;
                newWinTrade.document.body.appendChild(newScript);
            }));
        }), 0);
    }));
    let accountBTNTab = document.getElementById("account-btn-info");
    if (accountBTNTab) accountBTNTab.addEventListener("click", (function() {
        let newWin = window.open("", "", "left=50%, width=1000,height=200");
        let cloneContentAccount = $("#account-info-content").clone();
        let cloneHead = $("head").clone();
        let createDiv = document.createElement("div");
        createDiv.appendChild(cloneHead[0]);
        createDiv.appendChild(cloneContentAccount[0]);
        newWin.document.body.appendChild(createDiv);
        setTimeout((function() {
            let AllScript = document.querySelectorAll("script");
            AllScript.forEach((function(script, index) {
                let newScript = document.createElement("script");
                newScript.src = script.src;
                newWin.document.body.appendChild(newScript);
            }));
        }), 0);
    }));
    let chartBTNTab = document.getElementById("chart-btn-new");
    if (chartBTNTab) chartBTNTab.addEventListener("click", (function() {
        let newWin = window.open("", "", "left=50%, width=1000,height=500");
        let cloneContentAccount = $("#chart-content-tab").clone();
        let cloneHead = $("head").clone();
        let createDiv = document.createElement("div");
        createDiv.appendChild(cloneHead[0]);
        createDiv.appendChild(cloneContentAccount[0]);
        newWin.document.body.appendChild(createDiv);
        setTimeout((function() {
            let AllScript = document.querySelectorAll("script");
            AllScript.forEach((function(script, index) {
                let newScript = document.createElement("script");
                newScript.src = script.src;
                newWin.document.body.appendChild(newScript);
            }));
        }), 0);
    }));
    let orderBookBtn = document.getElementById("order-book-btn");
    if (orderBookBtn) orderBookBtn.addEventListener("click", (function() {
        let newWin = window.open("", "", "left=50%, width=1000,height=600");
        let cloneContentAccount = $("#order-book-tab").clone();
        let cloneHead = $("head").clone();
        let createDiv = document.createElement("div");
        createDiv.appendChild(cloneHead[0]);
        createDiv.appendChild(cloneContentAccount[0]);
        newWin.document.body.appendChild(createDiv);
        setTimeout((function() {
            let AllScript = document.querySelectorAll("script");
            AllScript.forEach((function(script, index) {
                let newScript = document.createElement("script");
                newScript.src = script.src;
                newWin.document.body.appendChild(newScript);
            }));
        }), 0);
    }));
    let timeBoxes = document.querySelectorAll(".boxes-time-item");
    timeBoxes.forEach((item => {
        item.addEventListener("click", (function(e) {
            timeBoxes.forEach((box => box.classList.remove("_active")));
            if (e.target.classList.contains("_active")) e.target.classList.remove("_active"); else e.target.classList.toggle("_active");
        }));
    }));
    let orderBoxes = document.querySelectorAll(".boxes-order-item");
    if (orderBoxes) orderBoxes.forEach((item => {
        item.addEventListener("click", (function(e) {
            orderBoxes.forEach((box => box.classList.remove("_active")));
            if (e.target.classList.contains("_active")) e.target.classList.remove("_active"); else e.target.classList.toggle("_active");
        }));
    }));
    const balenceLabel = document.getElementById("header-balance");
    if (balenceLabel) balenceLabel.addEventListener("click", (e => {
        e.target.classList.toggle("_active");
    }));
    const btnOpenLimitOrders = document.getElementById("open-limit-orders");
    const btnOpenTwap = document.getElementById("open-tab-twap");
    const btnOpenScaledOrder = document.getElementById("open-scaled-order");
    if (btnOpenTwap) btnOpenTwap.addEventListener("click", (() => {
        document.getElementById("TWAP").style.display = "block";
        document.getElementById("scaledOrder").style.display = "none";
        document.getElementById("limitOrders").style.display = "none";
    }));
    if (btnOpenLimitOrders) btnOpenLimitOrders.addEventListener("click", (() => {
        document.getElementById("limitOrders").style.display = "block";
        document.getElementById("TWAP").style.display = "none";
        document.getElementById("scaledOrder").style.display = "none";
    }));
    if (btnOpenScaledOrder) btnOpenScaledOrder.addEventListener("click", (() => {
        document.getElementById("scaledOrder").style.display = "block";
        document.getElementById("limitOrders").style.display = "none";
        document.getElementById("TWAP").style.display = "none";
    }));
    let LongLeverage = document.getElementById("long-leverage");
    let LongLeverageVolume = document.getElementById("Long-leverage-volume");
    if (LongLeverage) LongLeverage.addEventListener("input", (function() {
        LongLeverageVolume.textContent = this.value;
    }));
    let shortLeverage = document.getElementById("short-leverage");
    let shortLeverageVolume = document.getElementById("short-leverage-volume");
    if (shortLeverage) shortLeverage.addEventListener("input", (function() {
        shortLeverageVolume.textContent = this.value;
    }));
    let IsolatedBtn = document.getElementById("isolated-btn-check");
    let CrossBtn = document.getElementById("cross-btn-check");
    let IsolatedValue = document.getElementById("value-isolated");
    let CrossValue = document.getElementById("value-cross");
    if (IsolatedBtn) IsolatedBtn.addEventListener("click", (function(e) {
        e.preventDefault();
        e.target.classList.toggle("active");
        CrossBtn.classList.remove("active");
        IsolatedBtn.classList.add("active");
        IsolatedValue.classList.add("active");
        CrossValue.classList.remove("active");
    }));
    if (CrossBtn) CrossBtn.addEventListener("click", (function(e) {
        e.preventDefault();
        e.target.classList.toggle("active");
        CrossBtn.classList.add("active");
        IsolatedBtn.classList.remove("active");
        IsolatedValue.classList.remove("active");
        CrossValue.classList.add("active");
    }));
    const popupSlider = document.getElementById("popup-share");
    if (popupSlider) {
        new Swiper(".swiper", {
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            }
        });
    }
    const chartSection = document.getElementById("chart-content-tab");
    if (chartSection) new TradingView.widget({
        autosize: true,
        symbol: "COINBASE:BTCUSD",
        interval: "D",
        timezone: "Etc/UTC",
        allow_symbol_change: true,
        theme: "Dark",
        style: "1",
        locale: "en",
        toolbar_bg: "rgba(0, 0, 0, 1)",
        hide_top_toolbar: false,
        save_image: false,
        hideideas: true,
        order_book: true,
        container_id: "chart-content-tab"
    });
    document.querySelectorAll(".dropdown").forEach((function(dropdownWrapper) {
        const dropdownBtn = dropdownWrapper.querySelector(".dropdown__button");
        const dropdownList = dropdownWrapper.querySelector(".dropdown__list");
        const dropdownItems = dropdownList.querySelectorAll(".dropdown__list-item");
        const dropdownInput = dropdownWrapper.querySelector(".dropdown__input_hidden");
        dropdownBtn.addEventListener("click", (function() {
            dropdownList.classList.toggle("dropdown__list_visible");
            this.classList.toggle("dropdown__button_active");
        }));
        dropdownItems.forEach((function(listItem) {
            listItem.addEventListener("click", (function(e) {
                dropdownItems.forEach((function(el) {
                    el.classList.remove("dropdown__list-item_active");
                }));
                e.target.classList.add("dropdown__list-item_active");
                dropdownBtn.innerText = this.innerText;
                dropdownInput.value = this.dataset.value;
                dropdownList.classList.remove("dropdown__list_visible");
            }));
        }));
        document.addEventListener("click", (function(e) {
            if (e.target !== dropdownBtn) {
                dropdownBtn.classList.remove("dropdown__button_active");
                dropdownList.classList.remove("dropdown__list_visible");
            }
        }));
        document.addEventListener("keydown", (function(e) {
            if (e.key === "Tab" || e.key === "Escape") {
                dropdownBtn.classList.remove("dropdown__button_active");
                dropdownList.classList.remove("dropdown__list_visible");
            }
        }));
    }));
    let bars = document.querySelectorAll(".meter > span");
    if (bars) setInterval((function() {
        bars.forEach((function(bar) {
            var getWidth = parseFloat(bar.dataset.progress);
            for (var i = 0; i < getWidth; i++) bar.style.width = i + "%";
        }));
    }), 500);
    const AllRange = document.querySelectorAll("input[type=range");
    if (AllRange) AllRange.forEach((item => {
        if (item.nextElementSibling) {
            const ItemDotts = item.nextElementSibling.querySelectorAll(".dott");
            const showProgress = item.previousElementSibling;
            item.addEventListener("input", (function(e) {
                item.addEventListener("mousemove", (function(e) {
                    const val = item.value;
                    const min = item.min ? item.min : 0;
                    const max = item.max ? item.max : 100;
                    const newVal = Number((val - min) * 100 / (max - min));
                    this.style.background = "linear-gradient(to right, #2c5ce5 0%," + newVal + "%, #282e3a " + newVal + "%, #282e3a 100%)";
                    showProgress.innerHTML = val;
                    showProgress.style.left = `calc(${newVal}% + (${8 - newVal * .15}px))`;
                    ItemDotts.forEach(((dot, index) => {
                        if (e.target.value > 1) {
                            if (index === 0) dot.classList.add("_active");
                        } else if (index === 0) dot.classList.remove("_active");
                        if (newVal > 25) {
                            if (index === 1) dot.classList.add("_active");
                        } else if (index === 1) dot.classList.remove("_active");
                        if (newVal > 50) {
                            if (index === 2) dot.classList.add("_active");
                        } else if (index === 2) dot.classList.remove("_active");
                        if (newVal > 75) {
                            if (index === 3) dot.classList.add("_active");
                        } else if (index === 3) dot.classList.remove("_active");
                        if (newVal === 100) {
                            if (index === 4) dot.classList.add("_active");
                        } else if (index === 4) dot.classList.remove("_active");
                    }));
                }));
            }));
        }
    }));
    window["FLS"] = true;
    tabs();
})();