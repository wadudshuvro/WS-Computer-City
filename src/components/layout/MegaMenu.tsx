'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import {
  FALLBACK_MENU_TREE,
  resolveMenuHref,
  type MenuTreeItem,
} from '@/lib/menu';
import { enrichMenuWithBrandFlyouts } from '@/lib/componentBrandMenu';

const HOVER_CLOSE_DELAY_MS = 280;

export function MegaMenu() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuTreeItem[]>(() =>
    enrichMenuWithBrandFlyouts(FALLBACK_MENU_TREE)
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const categoryCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subCategoryCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/menus')
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (Array.isArray(json.data) && json.data.length > 0) {
          setMenu(enrichMenuWithBrandFlyouts(json.data));
        }
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const navFallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = (timer: { current: ReturnType<typeof setTimeout> | null }) => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const urlsMatch = (href: string) => {
    try {
      const want = new URL(href, window.location.origin);
      return (
        window.location.pathname === want.pathname &&
        window.location.search === want.search
      );
    } catch {
      return false;
    }
  };

  /**
   * Soft nav via App Router; after long idle Next soft-nav can stall.
   * We preventDefault (avoids filter blur races) then hard-navigate if URL
   * never changes.
   */
  const navigateTo = useCallback(
    (href: string) => {
      const go = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        clearTimer(categoryCloseTimer);
        clearTimer(subCategoryCloseTimer);
        clearTimer(navFallbackTimer);
        setActiveCategory(null);
        setActiveSubCategory(null);

        try {
          router.push(href);
        } catch {
          window.location.assign(href);
          return;
        }

        navFallbackTimer.current = setTimeout(() => {
          if (!urlsMatch(href)) {
            window.location.assign(href);
          }
        }, 500);
      };

      return {
        onMouseDown: go,
        onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
          if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
          ) {
            return;
          }
          event.preventDefault();
        },
      };
    },
    [router]
  );

  const openCategory = useCallback((id: string) => {
    clearTimer(categoryCloseTimer);
    clearTimer(subCategoryCloseTimer);
    setActiveCategory((prev) => {
      if (prev !== id) {
        setActiveSubCategory(null);
      }
      return id;
    });
  }, []);

  const scheduleCloseCategory = useCallback(() => {
    clearTimer(categoryCloseTimer);
    categoryCloseTimer.current = setTimeout(() => {
      setActiveCategory(null);
      setActiveSubCategory(null);
    }, HOVER_CLOSE_DELAY_MS);
  }, []);

  const openSubCategory = useCallback((id: string) => {
    clearTimer(subCategoryCloseTimer);
    setActiveSubCategory(id);
  }, []);

  const scheduleCloseSubCategory = useCallback(() => {
    clearTimer(subCategoryCloseTimer);
    subCategoryCloseTimer.current = setTimeout(() => {
      setActiveSubCategory(null);
    }, HOVER_CLOSE_DELAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      clearTimer(categoryCloseTimer);
      clearTimer(subCategoryCloseTimer);
      clearTimer(navFallbackTimer);
    };
  }, []);

  // After long idle / tab sleep, soft-nav can break — warm the router on return.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        try {
          router.refresh();
        } catch {
          /* ignore */
        }
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [router]);

  return (
    <nav className="relative z-[200] overflow-visible border-b border-gray-200 bg-white">
      <div className="container mx-auto overflow-visible">
        {/* Compact Star Tech density — never overflow-x-auto (clips flyouts). */}
        <ul className="relative z-[200] flex flex-nowrap items-center justify-start gap-0 overflow-visible whitespace-nowrap">
          {menu.map((category) => {
            const isActive = activeCategory === category.id;
            const showDropdown = category.children.length > 0 && isActive;
            const categoryHref = resolveMenuHref(category, category.slug);

            return (
              <li
                key={category.id}
                className="relative shrink-0 overflow-visible"
                onMouseEnter={() => openCategory(category.id)}
                onMouseLeave={scheduleCloseCategory}
              >
                <Link
                  href={categoryHref}
                  {...navigateTo(categoryHref)}
                  className={`block px-2.5 py-[7px] text-[14px] font-normal leading-none transition-colors ${
                    isActive
                      ? 'text-nav'
                      : 'text-gray-800 hover:text-nav'
                  }`}
                >
                  {category.name}
                </Link>

                {showDropdown && (
                  <div
                    className={`absolute left-0 top-full z-[300] overflow-visible border border-gray-200 border-t-[3px] border-t-nav bg-white text-gray-800 shadow-md ${
                      category.slug === 'monitor'
                        ? 'min-w-[440px]'
                        : category.slug === 'accessories'
                          ? 'min-w-[240px]'
                          : 'min-w-[210px]'
                    }`}
                    onMouseEnter={() => {
                      clearTimer(categoryCloseTimer);
                      openCategory(category.id);
                    }}
                  >
                    <ul
                      className={`overflow-visible py-0.5 ${
                        category.slug === 'monitor'
                          ? 'grid grid-flow-col grid-cols-2 grid-rows-[repeat(19,auto)]'
                          : ''
                      }`}
                    >
                      {category.children.map((subCat) => {
                        const hasChildren = subCat.children.length > 0;
                        const showArrow = hasChildren && !subCat.hideArrow;
                        const isSubActive = activeSubCategory === subCat.id;
                        const subHref = resolveMenuHref(
                          subCat,
                          category.slug,
                          category.slug
                        );

                        return (
                          <li
                            key={subCat.id}
                            className="relative overflow-visible"
                            onMouseEnter={() => {
                              clearTimer(subCategoryCloseTimer);
                              if (hasChildren) {
                                openSubCategory(subCat.id);
                              } else {
                                setActiveSubCategory(null);
                              }
                            }}
                            onMouseLeave={() => {
                              if (hasChildren) {
                                scheduleCloseSubCategory();
                              }
                            }}
                          >
                            <Link
                              href={subHref}
                              {...navigateTo(subHref)}
                              className={`flex items-center justify-between gap-2 px-3 py-[6px] text-[13px] font-normal leading-tight transition-colors ${
                                isSubActive
                                  ? 'bg-nav text-white'
                                  : 'text-gray-800 hover:bg-nav hover:text-white'
                              }`}
                            >
                              <span>{subCat.name}</span>
                              {showArrow && (
                                <ChevronRight
                                  className={`h-3 w-3 shrink-0 ${
                                    isSubActive ? 'text-white' : 'text-gray-400'
                                  }`}
                                />
                              )}
                            </Link>

                            {hasChildren && isSubActive && (
                              <div
                                className={`absolute left-full top-0 z-[310] -ml-px max-h-[70vh] overflow-y-auto border border-gray-200 bg-white text-gray-800 shadow-md ${
                                  category.slug === 'accessories' &&
                                  subCat.children.length > 12
                                    ? 'min-w-[340px]'
                                    : 'min-w-[170px]'
                                }`}
                                onMouseEnter={() => {
                                  clearTimer(subCategoryCloseTimer);
                                  openSubCategory(subCat.id);
                                }}
                                onMouseLeave={scheduleCloseSubCategory}
                              >
                                <ul
                                  className={
                                    category.slug === 'accessories' &&
                                    subCat.children.length > 12
                                      ? 'grid grid-cols-2 gap-x-0 py-0.5'
                                      : 'py-0.5'
                                  }
                                >
                                  {subCat.children.map((child) => {
                                    const childLink = resolveMenuHref(
                                      child,
                                      category.slug,
                                      subCat.slug
                                    );
                                    return (
                                      <li key={child.id}>
                                        <Link
                                          href={childLink}
                                          {...navigateTo(childLink)}
                                          className="block px-3 py-[6px] text-[13px] font-normal leading-tight text-gray-800 transition-colors hover:bg-nav hover:text-white"
                                        >
                                          {child.name}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
