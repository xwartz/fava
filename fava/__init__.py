"""Fava – A web interface for Beancount."""

from pkg_resources import get_distribution, DistributionNotFound

try:
    __version__ = get_distribution(__name__).version
except DistributionNotFound:
    # package is not installed
    pass

LOCALES = ["de", "es", "fa", "fr", "nl", "pt", "ru", "zh-CN", "sk", "uk"]
LANGUAGES = [locale[:2] for locale in LOCALES]
