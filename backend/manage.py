#!/usr/bin/env python
"""Utilitarul de linie de comandă al Django pentru sarcini administrative."""
import os
import sys


def main():
    """Execută sarcinile administrative ale proiectului."""
    # Se stabilește modulul de configurare implicit al proiectului Django.
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # Eroare ridicată în cazul în care Django nu poate fi importat,
        # de regulă din cauza unui mediu virtual neactivat sau a unei
        # instalări incomplete.
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    # Se transmit argumentele liniei de comandă către dispecerul Django.
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()