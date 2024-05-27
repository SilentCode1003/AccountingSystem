/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as LoginLayoutImport } from './routes/login/_layout'
import { Route as AuthenticatedLayoutImport } from './routes/_authenticated/_layout'
import { Route as LoginLayoutIndexImport } from './routes/login/_layout/index'
import { Route as AuthenticatedLayoutIndexImport } from './routes/_authenticated/_layout/index'
import { Route as AuthenticatedLayoutTransactionsIndexImport } from './routes/_authenticated/_layout/transactions_/index'
import { Route as AuthenticatedLayoutPayrollsIndexImport } from './routes/_authenticated/_layout/payrolls_/index'
import { Route as AuthenticatedLayoutInventoryEntriesIndexImport } from './routes/_authenticated/_layout/inventoryEntries_/index'
import { Route as AuthenticatedLayoutIncomestatementIndexImport } from './routes/_authenticated/_layout/income_statement_/index'
import { Route as AuthenticatedLayoutChequesIndexImport } from './routes/_authenticated/_layout/cheques_/index'
import { Route as AuthenticatedLayoutCashflowIndexImport } from './routes/_authenticated/_layout/cash_flow_/index'
import { Route as AuthenticatedLayoutBalancesheetIndexImport } from './routes/_authenticated/_layout/balance_sheet_/index'
import { Route as AuthenticatedLayoutSettingslayoutImport } from './routes/_authenticated/_layout/settings_/_layout'
import { Route as AuthenticatedLayoutSettingslayoutIndexImport } from './routes/_authenticated/_layout/settings_/_layout/index'
import { Route as AuthenticatedLayoutSettingslayoutVendorsImport } from './routes/_authenticated/_layout/settings_/_layout/vendors'
import { Route as AuthenticatedLayoutSettingslayoutUsersImport } from './routes/_authenticated/_layout/settings_/_layout/users'
import { Route as AuthenticatedLayoutSettingslayoutTransactionTypesImport } from './routes/_authenticated/_layout/settings_/_layout/transactionTypes'
import { Route as AuthenticatedLayoutSettingslayoutReportsImport } from './routes/_authenticated/_layout/settings_/_layout/reports'
import { Route as AuthenticatedLayoutSettingslayoutModesOfPaymentImport } from './routes/_authenticated/_layout/settings_/_layout/modesOfPayment'
import { Route as AuthenticatedLayoutSettingslayoutInventoryImport } from './routes/_authenticated/_layout/settings_/_layout/inventory'
import { Route as AuthenticatedLayoutSettingslayoutEmployeesImport } from './routes/_authenticated/_layout/settings_/_layout/employees'
import { Route as AuthenticatedLayoutSettingslayoutCustomersImport } from './routes/_authenticated/_layout/settings_/_layout/customers'
import { Route as AuthenticatedLayoutSettingslayoutAccountsImport } from './routes/_authenticated/_layout/settings_/_layout/accounts'
import { Route as AuthenticatedLayoutSettingslayoutAccountTypesImport } from './routes/_authenticated/_layout/settings_/_layout/accountTypes'

// Create Virtual Routes

const LoginImport = createFileRoute('/login')()
const AuthenticatedLayoutSettingsImport = createFileRoute(
  '/_authenticated/_layout/settings',
)()

// Create/Update Routes

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const LoginLayoutRoute = LoginLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => LoginRoute,
} as any)

const AuthenticatedLayoutRoute = AuthenticatedLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedLayoutSettingsRoute =
  AuthenticatedLayoutSettingsImport.update({
    path: '/settings',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const LoginLayoutIndexRoute = LoginLayoutIndexImport.update({
  path: '/',
  getParentRoute: () => LoginLayoutRoute,
} as any)

const AuthenticatedLayoutIndexRoute = AuthenticatedLayoutIndexImport.update({
  path: '/',
  getParentRoute: () => AuthenticatedLayoutRoute,
} as any)

const AuthenticatedLayoutTransactionsIndexRoute =
  AuthenticatedLayoutTransactionsIndexImport.update({
    path: '/transactions/',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutPayrollsIndexRoute =
  AuthenticatedLayoutPayrollsIndexImport.update({
    path: '/payrolls/',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutInventoryEntriesIndexRoute =
  AuthenticatedLayoutInventoryEntriesIndexImport.update({
    path: '/inventoryEntries/',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutIncomestatementIndexRoute =
  AuthenticatedLayoutIncomestatementIndexImport.update({
    path: '/income_statement/',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutChequesIndexRoute =
  AuthenticatedLayoutChequesIndexImport.update({
    path: '/cheques/',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutCashflowIndexRoute =
  AuthenticatedLayoutCashflowIndexImport.update({
    path: '/cash_flow/',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutBalancesheetIndexRoute =
  AuthenticatedLayoutBalancesheetIndexImport.update({
    path: '/balance_sheet/',
    getParentRoute: () => AuthenticatedLayoutRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutRoute =
  AuthenticatedLayoutSettingslayoutImport.update({
    id: '/_layout',
    getParentRoute: () => AuthenticatedLayoutSettingsRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutIndexRoute =
  AuthenticatedLayoutSettingslayoutIndexImport.update({
    path: '/',
    getParentRoute: () => AuthenticatedLayoutSettingslayoutRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutVendorsRoute =
  AuthenticatedLayoutSettingslayoutVendorsImport.update({
    path: '/vendors',
    getParentRoute: () => AuthenticatedLayoutSettingslayoutRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutUsersRoute =
  AuthenticatedLayoutSettingslayoutUsersImport.update({
    path: '/users',
    getParentRoute: () => AuthenticatedLayoutSettingslayoutRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutTransactionTypesRoute =
  AuthenticatedLayoutSettingslayoutTransactionTypesImport.update({
    path: '/transactionTypes',
    getParentRoute: () => AuthenticatedLayoutSettingslayoutRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutReportsRoute =
  AuthenticatedLayoutSettingslayoutReportsImport.update({
    path: '/reports',
    getParentRoute: () => AuthenticatedLayoutSettingslayoutRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutModesOfPaymentRoute =
  AuthenticatedLayoutSettingslayoutModesOfPaymentImport.update({
    path: '/modesOfPayment',
    getParentRoute: () => AuthenticatedLayoutSettingslayoutRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutInventoryRoute =
  AuthenticatedLayoutSettingslayoutInventoryImport.update({
    path: '/inventory',
    getParentRoute: () => AuthenticatedLayoutSettingslayoutRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutEmployeesRoute =
  AuthenticatedLayoutSettingslayoutEmployeesImport.update({
    path: '/employees',
    getParentRoute: () => AuthenticatedLayoutSettingslayoutRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutCustomersRoute =
  AuthenticatedLayoutSettingslayoutCustomersImport.update({
    path: '/customers',
    getParentRoute: () => AuthenticatedLayoutSettingslayoutRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutAccountsRoute =
  AuthenticatedLayoutSettingslayoutAccountsImport.update({
    path: '/accounts',
    getParentRoute: () => AuthenticatedLayoutSettingslayoutRoute,
  } as any)

const AuthenticatedLayoutSettingslayoutAccountTypesRoute =
  AuthenticatedLayoutSettingslayoutAccountTypesImport.update({
    path: '/accountTypes',
    getParentRoute: () => AuthenticatedLayoutSettingslayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/_layout': {
      id: '/_authenticated/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedLayoutImport
      parentRoute: typeof AuthenticatedImport
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/login/_layout': {
      id: '/login/_layout'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginLayoutImport
      parentRoute: typeof LoginRoute
    }
    '/_authenticated/_layout/': {
      id: '/_authenticated/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedLayoutIndexImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/login/_layout/': {
      id: '/login/_layout/'
      path: '/'
      fullPath: '/login/'
      preLoaderRoute: typeof LoginLayoutIndexImport
      parentRoute: typeof LoginLayoutImport
    }
    '/_authenticated/_layout/settings': {
      id: '/_authenticated/_layout/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthenticatedLayoutSettingsImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/settings/_layout': {
      id: '/_authenticated/_layout/settings/_layout'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutImport
      parentRoute: typeof AuthenticatedLayoutSettingsRoute
    }
    '/_authenticated/_layout/balance_sheet/': {
      id: '/_authenticated/_layout/balance_sheet/'
      path: '/balance_sheet/'
      fullPath: '/balance_sheet/'
      preLoaderRoute: typeof AuthenticatedLayoutBalancesheetIndexImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/cash_flow/': {
      id: '/_authenticated/_layout/cash_flow/'
      path: '/cash_flow/'
      fullPath: '/cash_flow/'
      preLoaderRoute: typeof AuthenticatedLayoutCashflowIndexImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/cheques/': {
      id: '/_authenticated/_layout/cheques/'
      path: '/cheques/'
      fullPath: '/cheques/'
      preLoaderRoute: typeof AuthenticatedLayoutChequesIndexImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/income_statement/': {
      id: '/_authenticated/_layout/income_statement/'
      path: '/income_statement/'
      fullPath: '/income_statement/'
      preLoaderRoute: typeof AuthenticatedLayoutIncomestatementIndexImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/inventoryEntries/': {
      id: '/_authenticated/_layout/inventoryEntries/'
      path: '/inventoryEntries/'
      fullPath: '/inventoryEntries/'
      preLoaderRoute: typeof AuthenticatedLayoutInventoryEntriesIndexImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/payrolls/': {
      id: '/_authenticated/_layout/payrolls/'
      path: '/payrolls/'
      fullPath: '/payrolls/'
      preLoaderRoute: typeof AuthenticatedLayoutPayrollsIndexImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/transactions/': {
      id: '/_authenticated/_layout/transactions/'
      path: '/transactions/'
      fullPath: '/transactions/'
      preLoaderRoute: typeof AuthenticatedLayoutTransactionsIndexImport
      parentRoute: typeof AuthenticatedLayoutImport
    }
    '/_authenticated/_layout/settings/_layout/accountTypes': {
      id: '/_authenticated/_layout/settings/_layout/accountTypes'
      path: '/accountTypes'
      fullPath: '/settings/accountTypes'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutAccountTypesImport
      parentRoute: typeof AuthenticatedLayoutSettingslayoutImport
    }
    '/_authenticated/_layout/settings/_layout/accounts': {
      id: '/_authenticated/_layout/settings/_layout/accounts'
      path: '/accounts'
      fullPath: '/settings/accounts'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutAccountsImport
      parentRoute: typeof AuthenticatedLayoutSettingslayoutImport
    }
    '/_authenticated/_layout/settings/_layout/customers': {
      id: '/_authenticated/_layout/settings/_layout/customers'
      path: '/customers'
      fullPath: '/settings/customers'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutCustomersImport
      parentRoute: typeof AuthenticatedLayoutSettingslayoutImport
    }
    '/_authenticated/_layout/settings/_layout/employees': {
      id: '/_authenticated/_layout/settings/_layout/employees'
      path: '/employees'
      fullPath: '/settings/employees'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutEmployeesImport
      parentRoute: typeof AuthenticatedLayoutSettingslayoutImport
    }
    '/_authenticated/_layout/settings/_layout/inventory': {
      id: '/_authenticated/_layout/settings/_layout/inventory'
      path: '/inventory'
      fullPath: '/settings/inventory'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutInventoryImport
      parentRoute: typeof AuthenticatedLayoutSettingslayoutImport
    }
    '/_authenticated/_layout/settings/_layout/modesOfPayment': {
      id: '/_authenticated/_layout/settings/_layout/modesOfPayment'
      path: '/modesOfPayment'
      fullPath: '/settings/modesOfPayment'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutModesOfPaymentImport
      parentRoute: typeof AuthenticatedLayoutSettingslayoutImport
    }
    '/_authenticated/_layout/settings/_layout/reports': {
      id: '/_authenticated/_layout/settings/_layout/reports'
      path: '/reports'
      fullPath: '/settings/reports'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutReportsImport
      parentRoute: typeof AuthenticatedLayoutSettingslayoutImport
    }
    '/_authenticated/_layout/settings/_layout/transactionTypes': {
      id: '/_authenticated/_layout/settings/_layout/transactionTypes'
      path: '/transactionTypes'
      fullPath: '/settings/transactionTypes'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutTransactionTypesImport
      parentRoute: typeof AuthenticatedLayoutSettingslayoutImport
    }
    '/_authenticated/_layout/settings/_layout/users': {
      id: '/_authenticated/_layout/settings/_layout/users'
      path: '/users'
      fullPath: '/settings/users'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutUsersImport
      parentRoute: typeof AuthenticatedLayoutSettingslayoutImport
    }
    '/_authenticated/_layout/settings/_layout/vendors': {
      id: '/_authenticated/_layout/settings/_layout/vendors'
      path: '/vendors'
      fullPath: '/settings/vendors'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutVendorsImport
      parentRoute: typeof AuthenticatedLayoutSettingslayoutImport
    }
    '/_authenticated/_layout/settings/_layout/': {
      id: '/_authenticated/_layout/settings/_layout/'
      path: '/'
      fullPath: '/settings/'
      preLoaderRoute: typeof AuthenticatedLayoutSettingslayoutIndexImport
      parentRoute: typeof AuthenticatedLayoutSettingslayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthenticatedRoute: AuthenticatedRoute.addChildren({
    AuthenticatedLayoutRoute: AuthenticatedLayoutRoute.addChildren({
      AuthenticatedLayoutIndexRoute,
      AuthenticatedLayoutSettingsRoute:
        AuthenticatedLayoutSettingsRoute.addChildren({
          AuthenticatedLayoutSettingslayoutRoute:
            AuthenticatedLayoutSettingslayoutRoute.addChildren({
              AuthenticatedLayoutSettingslayoutAccountTypesRoute,
              AuthenticatedLayoutSettingslayoutAccountsRoute,
              AuthenticatedLayoutSettingslayoutCustomersRoute,
              AuthenticatedLayoutSettingslayoutEmployeesRoute,
              AuthenticatedLayoutSettingslayoutInventoryRoute,
              AuthenticatedLayoutSettingslayoutModesOfPaymentRoute,
              AuthenticatedLayoutSettingslayoutReportsRoute,
              AuthenticatedLayoutSettingslayoutTransactionTypesRoute,
              AuthenticatedLayoutSettingslayoutUsersRoute,
              AuthenticatedLayoutSettingslayoutVendorsRoute,
              AuthenticatedLayoutSettingslayoutIndexRoute,
            }),
        }),
      AuthenticatedLayoutBalancesheetIndexRoute,
      AuthenticatedLayoutCashflowIndexRoute,
      AuthenticatedLayoutChequesIndexRoute,
      AuthenticatedLayoutIncomestatementIndexRoute,
      AuthenticatedLayoutInventoryEntriesIndexRoute,
      AuthenticatedLayoutPayrollsIndexRoute,
      AuthenticatedLayoutTransactionsIndexRoute,
    }),
  }),
  LoginRoute: LoginRoute.addChildren({
    LoginLayoutRoute: LoginLayoutRoute.addChildren({ LoginLayoutIndexRoute }),
  }),
})

/* prettier-ignore-end */
