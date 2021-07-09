import {PERMISSIONS} from '../../components/secutiry/PermissionConstants'

export const NAVIGATION_BAR_ITEMS = [
    {
        key: '3',
        path: '/home',
        iconType: 'home',
        translationKey: 'menu_home_title',
        permissions: [PERMISSIONS.auditorBase, PERMISSIONS.supervisor],
        breadcrumb: [
            {
                linkStatus: false,
                translateKey: 'breadcrumb_main_title',
            },
        ],
    },

    {
        key: '4',
        path: '/inspections/buyer',
        iconType: 'audit',
        translationKey: 'menu_checklists_audit_title',
        permissions: [PERMISSIONS.auditorBase, PERMISSIONS.supervisor],
        breadcrumb: [
            {
                linkStatus: false,
                translateKey: 'breadcrumb_main_title',
            },
        ],
    },

    {
        key: '5',
        path: '/analytics',
        iconType: 'bar-chart',
        translationKey: 'menu_analytics_title',
        permissions: [PERMISSIONS.supervisor, PERMISSIONS.head],
        breadcrumb: [
            {
                linkStatus: false,
                translateKey: 'breadcrumb_analytic_title',
            },
        ],
    },

    {
        key: '6',
        path: '/analytics/head',
        iconType: 'line-chart',
        translationKey: 'menu_analytics_title',
        permissions: [PERMISSIONS.head],
        breadcrumb: [
            {
                linkStatus: true,
                translateKey: 'breadcrumb_analytic_title',
            },
        ],
    },

    {
        key: '9',
        path: '/analytics/rate',
        iconType: 'fund',
        translationKey: 'menu_analytics_title',
        permissions: [PERMISSIONS.supervisor, PERMISSIONS.adminBase],
        breadcrumb: [
            {
                linkStatus: true,
                translateKey: 'breadcrumb_analytic_title',
            },
        ],
    },

    {
        key: '10',
        path: '/analytics/common-imf-checklist',
        iconType: 'check-square',
        translationKey: 'menu_checklist_imf',
        permissions: [PERMISSIONS.auditorBase, PERMISSIONS.supervisor, PERMISSIONS.adminBase],
        breadcrumb: [
            {
                linkStatus: true,
                translateKey: 'breadcrumb_analytic_title',
            },
        ],
    },

    {
        key: '12',
        path: '/analytics/ukr-avto-dor',
        iconType: 'car',
        translationKey: 'menu_ukr_avto_dor',
        permissions: [PERMISSIONS.auditorBase, PERMISSIONS.supervisor, PERMISSIONS.adminBase],
        additionalCheck: ['enableUrkAvtoDorAnalytics'],
        breadcrumb: [
            {
                linkStatus: true,
                translateKey: 'breadcrumb_analytic_title',
            },
        ],
    },

    // {
    //     key: '11',
    //     path: '/analytics/reports',
    //     iconType: '',
    //     translationKey: '',
    //     permissions: [PERMISSIONS.auditorBase, PERMISSIONS.supervisor, PERMISSIONS.adminBase],
    //     breadcrumb: [
    //         {
    //             linkStatus: false,
    //             translateKey: '',
    //         },
    //     ],
    // },

    // {
    //   key: '7',
    //   path: '/analytics/imf',
    //   iconType: 'rise',
    //   translationKey: 'menu_analytics_title',
    //   permissions: [PERMISSIONS.supervisor],
    //   breadcrumb: [
    //     {
    //       linkStatus: false,
    //       translateKey: 'breadcrumb_main_title',
    //     },
    //   ],
    // },

    {
        key: 'sub3',
        iconType: 'audit',
        translationKey: 'menu_checklists_title',
        needsAdminPermission: false,
        permissions: [PERMISSIONS.adminBase],
        subMenu: [
            {
                key: '1',
                path: '/templates',
                translationKey: 'menu_templates_title',
                iconType: 'snippets',
                permissions: [PERMISSIONS.auditorBase, PERMISSIONS.adminBase],
                breadcrumb: [
                    {
                        linkStatus: true,
                        path: '/',
                        translateKey: 'breadcrumb_main_title',
                    },
                    {
                        linkStatus: false,
                        translateKey: 'menu_checklists_title',
                    },
                    {
                        linkStatus: false,
                        translateKey: 'menu_templates_title',
                    },
                ],
            },
            {
                key: '2',
                path: '/inspections/buyer',
                iconType: 'audit',
                translationKey: 'menu_checklists_audit_title',
                permissions: [PERMISSIONS.auditorBase, PERMISSIONS.adminBase],
                breadcrumb: [
                    {
                        linkStatus: true,
                        path: '/',
                        translateKey: 'breadcrumb_main_title',
                    },
                    {
                        linkStatus: false,
                        translateKey: 'menu_checklists_title',
                    },
                    {
                        linkStatus: false,
                        translateKey: 'menu_checklists_audit_title',
                    },
                ],
            },
        ],
    },
    {
        key: 'sub2',
        iconType: 'tool',
        translationKey: 'menu_administration_title',
        needsAdminPermission: true,
        permissions: [PERMISSIONS.adminBase],
        subMenu: [
            {
                key: '8',
                path: '/administration/users',
                iconType: 'user',
                translationKey: 'menu_administration_users_title',
                permissions: [PERMISSIONS.adminBase],
                breadcrumb: [
                    {
                        linkStatus: true,
                        path: '/',
                        translateKey: 'breadcrumb_main_title',
                    },
                    {
                        linkStatus: false,
                        translateKey: 'menu_administration_title',
                    },
                    {
                        linkStatus: false,
                        translateKey: 'menu_administration_users_title',
                    },
                ],
            },
            {
                key: '12',
                path: '/administration/buyers',
                iconType: 'build',
                translationKey: 'menu_administration_buyers_title',
                permissions: [PERMISSIONS.adminBase],
                breadcrumb: [
                    {
                        linkStatus: true,
                        path: '/',
                        translateKey: 'breadcrumb_main_title',
                    },
                    {
                        linkStatus: false,
                        translateKey: 'menu_administration_title',
                    },
                    {
                        linkStatus: false,
                        translateKey: 'menu_administration_buyers_title',
                    },
                ],
            },
        ],
    },
]
