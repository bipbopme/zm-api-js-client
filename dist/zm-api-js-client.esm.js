import { makeExecutableSchema } from 'graphql-tools';
import mapValues from 'lodash/mapValues';
import DataLoader from 'dataloader';
import castArray from 'lodash/castArray';
import get from 'lodash/get';
import isError from 'lodash/isError';
import emitter from 'mitt';
import reduce from 'lodash/reduce';
import forEach from 'lodash/forEach';
import concat from 'lodash/concat';
import differenceBy from 'lodash/differenceBy';
import gql from 'graphql-tag';
import { ApolloLink, Observable } from 'apollo-link';
import { BatchLink } from 'apollo-link-batch';
import { graphql } from 'graphql';
import { print } from 'graphql/language/printer';
import { ErrorLink } from 'apollo-link-error';
import { IntrospectionFragmentMatcher, InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function normalizeKey(key, schema) {
  var inverse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var getKey = inverse ? schema.inverseKey : schema.key;
  var schemaValue = getKey(key);

  if (typeof schemaValue === 'string') {
    return {
      key: schemaValue
    };
  }

  if (Array.isArray(schemaValue)) {
    return {
      key: schemaValue[0],
      nestedSchema: schemaValue[1]
    };
  }

  if (schemaValue instanceof Entity) {
    return {
      key: key,
      nestedSchema: schemaValue
    };
  }

  return {
    key: key
  };
}

function _normalize(data, schema) {
  var inverse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return reduce(data, function (result, v, k) {
    var _normalizeKey = normalizeKey(k, schema, inverse),
        key = _normalizeKey.key,
        nestedSchema = _normalizeKey.nestedSchema;

    var type = _typeof(v);

    if (Array.isArray(v)) {
      result[key] = v.map(function (i) {
        return nestedSchema ? _normalize(i, nestedSchema, inverse) : i;
      });
    } else if (type === 'object' && v !== null) {
      result[key] = nestedSchema ? _normalize(v, nestedSchema, inverse) : v;
    } else {
      result[key] = v;
    }

    return result;
  }, {});
}

var Entity =
/*#__PURE__*/
function () {
  function Entity(mapping) {
    _classCallCheck(this, Entity);

    this.inverseMapping = {};
    this.mapping = {};
    this.addMapping(mapping);
    this.key = this.key.bind(this);
    this.inverseKey = this.inverseKey.bind(this);
  }

  _createClass(Entity, [{
    key: "addMapping",
    value: function addMapping(mapping) {
      this.mapping = _objectSpread2({}, this.mapping, {}, mapping);
      this.inverseMapping = this.initInverseMapping(this.mapping);
    }
  }, {
    key: "initInverseMapping",
    value: function initInverseMapping(mapping) {
      var _this = this;

      var accumulator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return reduce(mapping, function (result, v, k) {
        if (Array.isArray(v)) {
          result[v[0]] = [k, v[1]];
        } else if (_typeof(v) === 'object' && !(v instanceof Entity)) {
          result[k] = _this.initInverseMapping(v);
        } else if (typeof v === 'string') {
          result[v] = k;
        } else {
          result[k] = v;
        }

        return result;
      }, accumulator);
    }
  }, {
    key: "inverseKey",
    value: function inverseKey(k) {
      return this.inverseMapping[k];
    }
  }, {
    key: "key",
    value: function key(k) {
      return this.mapping[k];
    }
  }]);

  return Entity;
}();
function normalize(schema) {
  return function (data) {
    return Array.isArray(data) ? data.map(function (v) {
      return _normalize(v, schema);
    }) : _normalize(data, schema);
  };
}
function denormalize(schema) {
  return function (data) {
    return Array.isArray(data) ? data.map(function (v) {
      return _normalize(v, schema, true);
    }) : _normalize(data, schema, true);
  };
}

var MimePart = new Entity({
  cd: 'contentDisposition',
  ci: 'contentId',
  ct: 'contentType',
  s: 'size',
  part: 'part',
  mid: 'messageId',
  content: 'content'
});
var CalendarItemAlarmTriggerRelative = new Entity({
  w: 'weeks',
  d: 'days',
  h: 'hours',
  m: 'minutes',
  s: 'seconds',
  related: 'relatedTo',
  neg: 'negative'
});
var CalendarItemAlarmTrigger = new Entity({
  rel: ['relative', CalendarItemAlarmTriggerRelative]
});
var IntervalRule = new Entity({
  ival: 'intervalCount'
});
var NumOfOccurences = new Entity({
  num: 'number'
});
var UntilDate = new Entity({
  d: 'date'
});
var ByMonthDayRule = new Entity({
  modaylist: 'dayList'
});
var ByMonthRule = new Entity({
  molist: 'monthList'
});
var SimpleRepeatingRule = new Entity({
  freq: 'frequency',
  interval: ['interval', IntervalRule],
  count: ['count', NumOfOccurences],
  until: ['until', UntilDate],
  bymonthday: ['bymonthday', ByMonthDayRule],
  bymonth: ['bymonth', ByMonthRule]
});
var AddRecurrenceInfo = new Entity({
  rule: ['rule', SimpleRepeatingRule]
});
var RecurrenceInfo = new Entity({
  add: ['add', AddRecurrenceInfo]
});
var CalendarItemAlarmAttendees = new Entity({
  a: 'email'
});
var CalendarItemAlarm = new Entity({
  trigger: CalendarItemAlarmTrigger,
  at: ['attendees', CalendarItemAlarmAttendees]
});
var CalendarItemDateTime = new Entity({
  d: 'date',
  tz: 'timezone',
  tzoDue: 'timezoneDue',
  u: 'utc'
});
var CalendarItemAttendees = new Entity({
  ptst: 'participationStatus',
  a: 'address',
  d: 'name',
  cutype: 'calendarUserType'
});
var CalendarItemReply = new Entity({
  ptst: 'participationStatus',
  at: 'attendee'
});
var CalendarItemOrganizer = new Entity({
  a: 'address',
  d: 'name'
});
var commonFieldForMessageAndDocuments = {
  d: 'date',
  f: 'flags',
  l: 'folderId',
  md: 'changeDate',
  ms: 'modifiedSequence',
  rev: 'revision',
  s: 'size',
  sf: 'sortField',
  t: 'tags',
  tn: 'tagNames'
};

var commonMessageFields = _objectSpread2({}, commonFieldForMessageAndDocuments, {
  cid: 'conversationId',
  fr: 'excerpt'
});

var commonInviteFields = {
  compNum: 'componentNum',
  calItemId: 'calendarItemId',
  fb: 'freeBusy',
  fba: 'freeBusyActual',
  fr: 'excerpt',
  isOrg: 'isOrganizer',
  invId: 'inviteId',
  loc: 'location',
  or: ['organizer', CalendarItemOrganizer],
  ridZ: 'utcRecurrenceId'
};
var InviteComponent = new Entity(_objectSpread2({}, commonMessageFields, {}, commonInviteFields, {
  alarm: ['alarms', CalendarItemAlarm],
  at: ['attendees', CalendarItemAttendees],
  completed: 'completedDateTime',
  desc: 'description',
  descHtml: 'htmlDescription',
  e: ['end', CalendarItemDateTime],
  ex: 'isException',
  recur: ['recurrence', RecurrenceInfo],
  s: ['start', CalendarItemDateTime],
  exceptId: ['exceptId', CalendarItemDateTime],
  seq: 'sequence'
}));
var InviteReplies = new Entity({
  reply: ['reply', CalendarItemReply]
});
var CalTZInfo = new Entity({
  stdoff: 'timezoneStdOffset',
  dayoff: 'timezoneDaylightOffset'
});
var Invitation = new Entity({
  seq: 'sequenceNumber',
  compNum: 'componentNum',
  recurId: 'recurrenceId',
  tz: ['tz', CalTZInfo],
  comp: ['components', InviteComponent],
  replies: ['replies', InviteReplies],
  mp: ['mimeParts', MimePart]
});
var InviteInfo = new Entity({
  comp: ['components', InviteComponent],
  replies: ['replies', InviteReplies],
  mp: ['mimeParts', MimePart]
});
var MailItemEmailAddress = new Entity({
  a: 'address',
  p: 'name',
  d: 'displayName',
  t: 'type'
});
var ExistingAttachmentsInfo = new Entity({
  mid: 'messageId',
  part: 'part'
});
var AttachmentsInfo = new Entity({
  aid: 'attachmentId',
  doc: 'documents',
  mp: ['existingAttachments', ExistingAttachmentsInfo]
});
MimePart.addMapping({
  mp: ['mimeParts', MimePart],
  attach: ['attachments', AttachmentsInfo]
});

var commonMailItemFields = _objectSpread2({}, commonMessageFields, {
  e: ['emailAddresses', MailItemEmailAddress],
  inv: ['invitations', InviteInfo],
  mp: ['mimeParts', MimePart],
  shr: 'share',
  su: 'subject',
  origid: 'origId',
  attach: ['attachments', AttachmentsInfo],
  rt: 'replyType'
});

var SendMessageFields = new Entity(_objectSpread2({}, commonMailItemFields, {
  id: 'id',
  aid: 'attachmentId',
  irt: 'inReplyTo',
  rt: 'replyType',
  did: 'draftId',
  idnt: 'entityId'
}));
var SendMessageInfo = new Entity({
  m: ['message', SendMessageFields]
});
var MessageInfo = new Entity(_objectSpread2({}, commonMailItemFields));
var AppointmentInfo = new Entity({
  inv: ['invitations', Invitation]
});
var Conversation = new Entity(_objectSpread2({}, commonMailItemFields, {
  n: 'numMessages',
  m: ['messages', MessageInfo],
  u: 'unread'
}));
var SearchConversation = new Entity(_objectSpread2({}, commonMailItemFields, {
  n: 'numMessages',
  m: ['messagesMetaData', MessageInfo],
  u: 'unread'
}));
var CalendarItemCreateModifyRequest = new Entity({
  rev: 'revision',
  comp: 'componentNum',
  m: ['message', MessageInfo],
  apptId: 'appointmentId',
  calItemId: 'calendarItemId',
  invId: 'inviteId'
});
var CounterAppointmentInfo = new Entity({
  rev: 'revision',
  comp: 'componentNum',
  m: ['message', MessageInfo],
  invId: 'inviteId'
});
var InstanceDate = new Entity({
  d: 'date',
  tz: 'timezone'
});
var CalendarItemDeleteRequest = new Entity({
  inst: ['instanceDate', InstanceDate],
  id: 'inviteId',
  comp: 'componentNum',
  s: 'start',
  m: ['message', MessageInfo]
});
var NewMountpointSpec = new Entity({
  rid: 'sharedItemId',
  zid: 'ownerZimbraId',
  f: 'flags',
  l: 'parentFolderId'
});
var CreateMountpointRequest = new Entity({
  link: NewMountpointSpec
});
var commonAccessControlEntities = {
  d: 'address',
  gt: 'granteeType',
  zid: 'zimbraId',
  pw: 'password'
};
var ACLGrant = new Entity(_objectSpread2({}, commonAccessControlEntities, {
  perm: 'permissions'
}));
var ACL = new Entity({
  grant: ACLGrant
});
var ShareNotificationAddress = new Entity({
  a: 'address',
  t: 'type',
  p: 'personalName'
});
var Instance = new Entity(_objectSpread2({}, commonMessageFields, {}, commonInviteFields, {
  otherAtt: 'otherAttendees',
  s: 'start',
  ptst: 'participationStatus',
  dur: 'duration',
  ex: 'isException'
}));
var Alarm = new Entity({
  compNum: 'componentNum',
  invId: 'inviteId',
  loc: 'location'
});
var CalendarItemHitInfo = new Entity(_objectSpread2({}, commonMessageFields, {}, commonInviteFields, {
  recur: 'isRecurring',
  ptst: 'participationStatus',
  dur: 'duration',
  tzo: 'timezoneOffset',
  otherAtt: 'otherAttendees',
  inst: ['instances', Instance],
  inv: ['invitations', Invitation],
  alarmData: ['alarmData', Alarm],
  sf: 'sortField'
}));
var Hit = new Entity({
  sf: 'sortField'
});
var Folder = new Entity({
  u: 'unread',
  l: 'parentFolderId',
  f: 'flags',
  n: 'nonFolderItemCount',
  s: 'nonFolderItemCountTotal',
  rev: 'revision',
  acl: ACL,
  perm: 'permissions',
  rid: 'sharedItemId',
  zid: 'ownerZimbraId'
});
Folder.addMapping({
  folder: ['folders', Folder],
  link: ['linkedFolders', Folder]
});
var ForwardMessageInput = new Entity({
  e: ['emailAddresses', MailItemEmailAddress],
  mp: ['mimeParts', MimePart],
  su: 'subject'
});
var ForwardAppointmentInfo = new Entity({
  m: ['message', ForwardMessageInput],
  exceptId: ['exceptId', InstanceDate]
});
var ForwardAppointmentInviteInfo = new Entity({
  m: ['message', ForwardMessageInput]
});
var FreeBusyInstance = new Entity({
  s: 'start',
  e: 'end'
});
var FreeBusy = new Entity({
  t: ['tentative', FreeBusyInstance],
  f: ['free', FreeBusyInstance],
  b: ['busy', FreeBusyInstance],
  u: ['unavailable', FreeBusyInstance],
  n: ['nodata', FreeBusyInstance]
});
var ActionOptions = new Entity({
  l: 'folderId',
  tcon: 'constraints',
  tn: 'tagNames',
  f: 'flags',
  zid: 'zimbraId',
  grant: ACLGrant
});
var AutoComplete = new Entity({
  t: 'type'
});
var AutoCompleteMatch = new Entity({
  l: 'folderId'
});
var AutoCompleteResponse = new Entity({
  match: AutoCompleteMatch
});
var ShareNotification = new Entity({
  e: ['address', ShareNotificationAddress]
});
var ExternalCalendar = new Entity({
  name: 'accountName',
  l: 'folderId'
});
var ImageFields = new Entity({
  ct: 'contentType',
  s: 'size'
});
var ContactAttributes = new Entity({
  image: ImageFields
});
var contactFields = {
  d: 'date',
  l: 'folderId',
  rev: 'revision',
  sf: 'sortField',
  t: 'tags',
  tn: 'tagNames',
  _attrs: ['attributes', ContactAttributes]
};
var contactListMembers = new Entity({
  cn: ['contacts', new Entity(_objectSpread2({}, contactFields))]
});
var ClientInfoResponse = new Entity({
  _attrs: 'attributes'
});
var Contact = new Entity(_objectSpread2({}, contactFields, {
  m: ['members', contactListMembers]
}));
var AutoCompleteGALResponse = new Entity({
  cn: ['contacts', Contact]
});
var Appointment = new Entity({
  alarm: 'alarm',
  inst: ['instances', Instance]
});
var Document = new Entity(_objectSpread2({}, commonFieldForMessageAndDocuments, {
  luuid: 'folderUuid',
  mdver: 'metadataVersion',
  meta: 'metaData',
  descEnabled: 'descriptionEnabled',
  ver: 'version',
  leb: 'lastEditedAccount',
  cr: 'revisonCreator',
  cd: 'revisedCreationDate',
  loid: 'lockOwnerId',
  ct: 'contentType'
}));
var MessagePartInputForDocuments = new Entity({
  id: 'messageId',
  part: 'attachmentPart'
});
var SaveDocument = new Entity({
  l: 'folderId',
  name: 'name',
  ver: 'version',
  ct: 'contentType',
  descEnabled: 'descriptionEnabled',
  m: ['messageData', MessagePartInputForDocuments]
});
var SearchResponse = new Entity({
  m: ['messages', MessageInfo],
  c: ['conversations', SearchConversation],
  cn: ['contacts', Contact],
  appt: ['appointments', CalendarItemHitInfo],
  doc: ['documents', Document],
  hit: Hit
});
var GetAppointmentResponse = new Entity({
  appt: ['appointment', AppointmentInfo]
});
var RedirectAction = new Entity({
  a: 'address'
});
var NotifyAction = new Entity({
  a: 'address',
  su: 'subject'
});
var FilterAction = new Entity({
  actionKeep: 'keep',
  actionDiscard: 'discard',
  actionFileInto: 'fileInto',
  actionFlag: 'flag',
  actionTag: 'tag',
  actionRedirect: ['redirect', RedirectAction],
  actionReply: 'reply',
  actionNotify: ['notify', NotifyAction],
  actionStop: 'stop'
});
var DateCondition = new Entity({
  d: 'date'
});
var ImportanceCondition = new Entity({
  imp: 'importance'
});
var SizeCondition = new Entity({
  s: 'size'
});
var FilterCondition = new Entity({
  condition: 'allOrAny',
  addressBookTest: 'addressBook',
  addressTest: 'address',
  attachmentTest: 'attachment',
  bodyTest: 'body',
  bulkTest: 'bulk',
  contactRankingTest: 'contactRanking',
  conversationTest: 'conversation',
  dateTest: ['date', DateCondition],
  facebookTest: 'facebook',
  flaggedTest: 'flag',
  headerExistsTest: 'headerExists',
  headerTest: 'header',
  importanceTest: ['importance', ImportanceCondition],
  inviteTest: 'invite',
  linkedinTest: 'linkedin',
  listTest: 'list',
  meTest: 'me',
  mimeHeaderTest: 'mimeHeader',
  sizeTest: ['size', SizeCondition],
  twitterTest: 'twitter',
  communityRequestsTest: 'communityRequests',
  communityContentTest: 'communityContent',
  communityConnectionsTest: 'communityConnections'
});
var Filter = new Entity({
  filterActions: ['actions', FilterAction],
  filterTests: ['conditions', FilterCondition]
});
var InviteReply = new Entity({
  compNum: 'componentNum',
  m: ['message', MessageInfo],
  rt: 'replyType',
  exceptId: ['exceptId', InstanceDate]
});
var Signature = new Entity({
  cid: 'contentId'
});
var CreateSignatureRequest = new Entity({
  signature: Signature
});
var GetFolderSpec = new Entity({
  l: 'parentFolderId'
});
var GetFolderRequest = new Entity({
  tr: 'traverseMountpoints',
  folder: GetFolderSpec
});
var ContactInputAttributes = new Entity({
  n: 'name',
  _content: 'content'
});
var ContactInputRequest = new Entity({
  l: 'folderId',
  tn: 'tagNames',
  a: ['attributes', ContactInputAttributes],
  m: 'memberOps'
});
var contentInfo = new Entity({
  _content: 'content'
});
var AddMsgAttributes = new Entity({
  content: ['content', contentInfo],
  d: 'date',
  f: 'flags',
  l: 'folderId',
  t: 'tags',
  tn: 'tagNames'
});
var AddMsgInfo = new Entity({
  m: ['message', AddMsgAttributes]
});
var OnlyEmailAddress = new Entity({
  addr: 'emailAddress'
});
var Target = new Entity({
  d: 'displayName',
  email: ['email', OnlyEmailAddress]
});
var Targets = new Entity({
  target: ['target', Target]
});
var DiscoverRightsResponse = new Entity({
  targets: ['targets', Targets]
});
var AccountACEInfo = new Entity(_objectSpread2({}, commonAccessControlEntities, {
  chkgt: 'checkGrantee'
}));
var AccountRights = new Entity({
  ace: ['access', AccountACEInfo]
});
var SaveDocuments = new Entity({
  doc: ['document', SaveDocument]
});
var GetRightsRequest = new Entity({
  ace: 'access'
});
var CreateAppSpecificPasswordResponse = new Entity({
  pw: 'password'
});
var Tag = new Entity({
  u: 'unread'
});
var Mailbox = new Entity({
  s: 'used'
});

var Namespace;

(function (Namespace) {
  Namespace["Account"] = "urn:zimbraAccount";
  Namespace["Admin"] = "urn:zimbraAdmin";
  Namespace["Mail"] = "urn:zimbraMail";
  Namespace["All"] = "urn:zimbra";
})(Namespace || (Namespace = {}));

var DEFAULT_HOSTNAME = '/@zimbra';
var DEFAULT_SOAP_PATHNAME = '/service/soap';

function soapCommandBody(options) {
  return _objectSpread2({
    _jsns: options.namespace || Namespace.Mail
  }, options.body);
}

function parseJSON(response) {
  if (!response.ok) {
    if ([502, 503, 504].indexOf(response.status) !== -1) {
      throw networkError(response);
    }

    return parseErrorJSON(response).then(function (parsedResponse) {
      var fault = get(parsedResponse.parsed, 'Body.Fault');
      throw faultError(parsedResponse, [fault]);
    });
  }

  return _responseParseHandler(response);
}

function _responseParseHandler(response) {
  try {
    return response.json().then(function (json) {
      response.parsed = json;
      return response;
    });
  } catch (e) {
    response.parseError = e;
    return Promise.resolve(response);
  }
}

function parseErrorJSON(response) {
  return _responseParseHandler(response);
}

function networkError(response) {
  var message = "Network request failed with status ".concat(response.status).concat(response.statusText ? "- \"".concat(response.statusText, "\"") : '');
  var error = new Error(message);
  error.message = message;
  error.response = response;
  error.parseError = response.parseError;
  return error;
}

function faultReasonText() {
  var faults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (!Array.isArray(faults)) faults = [faults];
  return faults.map(function (f) {
    return get(f, 'Reason.Text');
  }).filter(Boolean).join(', ');
}

function faultError(response, faults) {
  var error = new Error("Fault error: ".concat(faults ? faultReasonText(faults) : 'Unknown Error'));
  error.response = response;
  error.parseError = response.parseError;
  error.faults = faults;
  return error;
}

function batchBody(requests) {
  return reduce(requests, function (body, request) {
    var key = "".concat(request.name, "Request");
    var value = soapCommandBody(request);

    if (body[key]) {
      body[key].push(value);
    } else {
      body[key] = [value];
    }

    return body;
  }, {});
}

function batchResponse(requests, response) {
  var _response$body = response.body,
      _ = _response$body._jsns,
      batchBody = _objectWithoutProperties(_response$body, ["_jsns"]),
      res = _objectWithoutProperties(response, ["body"]);

  var indexes = {};
  return _objectSpread2({}, res, {
    requests: reduce(requests, function (responses, request) {
      var batchResponses = batchBody["".concat(request.name, "Response")];
      var index = indexes[request.name];
      var response = batchResponses && batchResponses[index || 0];

      if (response) {
        responses.push({
          body: response
        });
      } else {
        responses.push(faultError(res.originalResponse, batchBody.Fault));
      }

      if (index) {
        indexes[request.name] += 1;
      } else {
        indexes[request.name] = 1;
      }

      return responses;
    }, [])
  });
}

function batchJsonRequest(options) {
  var requests = options.requests,
      requestOptions = _objectWithoutProperties(options, ["requests"]);

  var body = batchBody(requests);
  return jsonRequest(_objectSpread2({}, requestOptions, {
    name: 'Batch',
    namespace: Namespace.All,
    body: body
  })).then(function (res) {
    return batchResponse(requests, res);
  });
}
function jsonRequest(requestOptions) {
  var options = _objectSpread2({}, requestOptions, {
    credentials: requestOptions.credentials || 'include',
    headers: requestOptions.headers || {},
    origin: requestOptions.origin !== undefined ? requestOptions.origin : DEFAULT_HOSTNAME,
    soapPathname: requestOptions.soapPathname || DEFAULT_SOAP_PATHNAME,
    namespace: requestOptions.namespace || Namespace.Mail
  });

  var soapRequestName = "".concat(options.name, "Request");
  var soapResponseName = "".concat(options.name, "Response");
  var url = "".concat(options.origin).concat(options.soapPathname, "/").concat(soapRequestName);
  var header;
  header = {
    context: {
      _jsns: Namespace.All,
      authTokenControl: {
        voidOnExpired: true
      }
    }
  };

  if (requestOptions.userAgent) {
    header.context.userAgent = requestOptions.userAgent;
  }

  if (requestOptions.sessionId) {
    header.context.session = {
      id: requestOptions.sessionId,
      _content: requestOptions.sessionId
    };
  }

  if (requestOptions.sessionSeq) {
    header.context.notify = {
      seq: requestOptions.sessionSeq
    };
  }

  if (requestOptions.accountName) {
    header.context.account = {
      by: 'name',
      _content: requestOptions.accountName
    };
  }

  if (requestOptions.accountId) {
    header.context.account = {
      by: 'id',
      _content: requestOptions.accountId
    };
  }

  if (requestOptions.jwtToken) {
    header.context.authToken = {
      _content: requestOptions.jwtToken
    };
  }

  if (requestOptions.csrfToken) {
    options.headers['X-Zimbra-Csrf-Token'] = requestOptions.csrfToken;
    header.context.csrfToken = requestOptions.csrfToken;
  }

  var body = _defineProperty({}, soapRequestName, soapCommandBody(options));

  return fetch(url, {
    method: 'POST',
    credentials: options.credentials,
    body: JSON.stringify({
      Body: body,
      Header: header
    }),
    headers: options.headers
  }).then(parseJSON).then(function (response) {
    var globalFault = get(response.parsed, 'Body.Fault');

    if (globalFault) {
      throw faultError(response, globalFault);
    }

    return {
      body: response.parsed.Body[soapResponseName],
      header: response.parsed.Header,
      namespace: response.parsed._jsns,
      originalResponse: response
    };
  });
}

var AccountType;

(function (AccountType) {
  AccountType["Imap"] = "imap";
  AccountType["Pop3"] = "pop3";
})(AccountType || (AccountType = {}));

var ActionTypeName;

(function (ActionTypeName) {
  ActionTypeName["ContactAction"] = "ContactAction";
  ActionTypeName["ConvAction"] = "ConvAction";
  ActionTypeName["DistributionList"] = "DistributionList";
  ActionTypeName["FolderAction"] = "FolderAction";
  ActionTypeName["ItemAction"] = "ItemAction";
  ActionTypeName["MsgAction"] = "MsgAction";
  ActionTypeName["TagAction"] = "TagAction";
})(ActionTypeName || (ActionTypeName = {}));

var AddressType;

(function (AddressType) {
  AddressType["F"] = "f";
  AddressType["T"] = "t";
  AddressType["C"] = "c";
  AddressType["B"] = "b";
  AddressType["R"] = "r";
  AddressType["S"] = "s";
  AddressType["N"] = "n";
  AddressType["Rf"] = "rf";
})(AddressType || (AddressType = {}));

var AlarmAction;

(function (AlarmAction) {
  AlarmAction["Display"] = "DISPLAY";
  AlarmAction["Audio"] = "AUDIO";
  AlarmAction["Email"] = "EMAIL";
  AlarmAction["Procedure"] = "PROCEDURE";
  AlarmAction["XYahooCalendarActionIm"] = "X_YAHOO_CALENDAR_ACTION_IM";
  AlarmAction["XYahooCalendarActionMobile"] = "X_YAHOO_CALENDAR_ACTION_MOBILE";
  AlarmAction["None"] = "NONE";
})(AlarmAction || (AlarmAction = {}));

var AlarmRelatedTo;

(function (AlarmRelatedTo) {
  AlarmRelatedTo["Start"] = "START";
  AlarmRelatedTo["End"] = "END";
})(AlarmRelatedTo || (AlarmRelatedTo = {}));

var AutoCompleteMatchType;

(function (AutoCompleteMatchType) {
  AutoCompleteMatchType["Gal"] = "gal";
  AutoCompleteMatchType["Contact"] = "contact";
  AutoCompleteMatchType["RankingTable"] = "rankingTable";
})(AutoCompleteMatchType || (AutoCompleteMatchType = {}));

var CalendarItemClass;

(function (CalendarItemClass) {
  CalendarItemClass["Pri"] = "PRI";
  CalendarItemClass["Pub"] = "PUB";
  CalendarItemClass["Con"] = "CON";
})(CalendarItemClass || (CalendarItemClass = {}));

var CalendarItemRecurrenceFrequency;

(function (CalendarItemRecurrenceFrequency) {
  CalendarItemRecurrenceFrequency["Sec"] = "SEC";
  CalendarItemRecurrenceFrequency["Min"] = "MIN";
  CalendarItemRecurrenceFrequency["Hou"] = "HOU";
  CalendarItemRecurrenceFrequency["Dai"] = "DAI";
  CalendarItemRecurrenceFrequency["Wee"] = "WEE";
  CalendarItemRecurrenceFrequency["Mon"] = "MON";
  CalendarItemRecurrenceFrequency["Yea"] = "YEA";
})(CalendarItemRecurrenceFrequency || (CalendarItemRecurrenceFrequency = {}));

var ConnectionType;

(function (ConnectionType) {
  ConnectionType["Cleartext"] = "cleartext";
  ConnectionType["Ssl"] = "ssl";
  ConnectionType["Tls"] = "tls";
  ConnectionType["TlsIsAvailable"] = "tls_is_available";
})(ConnectionType || (ConnectionType = {}));

var ContactType;

(function (ContactType) {
  ContactType["C"] = "C";
  ContactType["G"] = "G";
  ContactType["I"] = "I";
})(ContactType || (ContactType = {}));

var FilterMatchCondition;

(function (FilterMatchCondition) {
  FilterMatchCondition["Allof"] = "allof";
  FilterMatchCondition["Anyof"] = "anyof";
})(FilterMatchCondition || (FilterMatchCondition = {}));

var FolderView;

(function (FolderView) {
  FolderView["Search"] = "search";
  FolderView["Folder"] = "folder";
  FolderView["Tag"] = "tag";
  FolderView["Conversation"] = "conversation";
  FolderView["Message"] = "message";
  FolderView["Contact"] = "contact";
  FolderView["Document"] = "document";
  FolderView["Appointment"] = "appointment";
  FolderView["Virtual"] = "virtual";
  FolderView["Remote"] = "remote";
  FolderView["Wiki"] = "wiki";
  FolderView["Task"] = "task";
  FolderView["Chat"] = "chat";
  FolderView["Note"] = "note";
  FolderView["Comment"] = "comment";
})(FolderView || (FolderView = {}));

var FreeBusyStatus;

(function (FreeBusyStatus) {
  FreeBusyStatus["F"] = "F";
  FreeBusyStatus["B"] = "B";
  FreeBusyStatus["T"] = "T";
  FreeBusyStatus["O"] = "O";
})(FreeBusyStatus || (FreeBusyStatus = {}));

var GalSearchType;

(function (GalSearchType) {
  GalSearchType["All"] = "all";
  GalSearchType["Account"] = "account";
  GalSearchType["Resource"] = "resource";
  GalSearchType["Group"] = "group";
})(GalSearchType || (GalSearchType = {}));

var GranteeType;

(function (GranteeType) {
  GranteeType["Usr"] = "usr";
  GranteeType["Grp"] = "grp";
  GranteeType["Egp"] = "egp";
  GranteeType["Dom"] = "dom";
  GranteeType["All"] = "all";
  GranteeType["Pub"] = "pub";
  GranteeType["Guest"] = "guest";
  GranteeType["Key"] = "key";
  GranteeType["Cos"] = "cos";
})(GranteeType || (GranteeType = {}));

var Importance;

(function (Importance) {
  Importance["High"] = "high";
  Importance["Normal"] = "normal";
  Importance["Low"] = "low";
})(Importance || (Importance = {}));

var InviteCompletionStatus;

(function (InviteCompletionStatus) {
  InviteCompletionStatus["Need"] = "NEED";
  InviteCompletionStatus["Tent"] = "TENT";
  InviteCompletionStatus["Conf"] = "CONF";
  InviteCompletionStatus["Canc"] = "CANC";
  InviteCompletionStatus["Comp"] = "COMP";
  InviteCompletionStatus["Inpr"] = "INPR";
  InviteCompletionStatus["Waiting"] = "WAITING";
  InviteCompletionStatus["Deferred"] = "DEFERRED";
})(InviteCompletionStatus || (InviteCompletionStatus = {}));

var InviteReplyType;

(function (InviteReplyType) {
  InviteReplyType["R"] = "r";
  InviteReplyType["W"] = "w";
})(InviteReplyType || (InviteReplyType = {}));

var InviteReplyVerb;

(function (InviteReplyVerb) {
  InviteReplyVerb["Accept"] = "ACCEPT";
  InviteReplyVerb["Decline"] = "DECLINE";
  InviteReplyVerb["Tentative"] = "TENTATIVE";
})(InviteReplyVerb || (InviteReplyVerb = {}));

var InviteType;

(function (InviteType) {
  InviteType["Appt"] = "appt";
  InviteType["Task"] = "task";
})(InviteType || (InviteType = {}));

var LicenseStatus;

(function (LicenseStatus) {
  LicenseStatus["Ok"] = "OK";
  LicenseStatus["NotInstalled"] = "NOT_INSTALLED";
  LicenseStatus["NotActivated"] = "NOT_ACTIVATED";
  LicenseStatus["InFuture"] = "IN_FUTURE";
  LicenseStatus["Expired"] = "EXPIRED";
  LicenseStatus["Invalid"] = "INVALID";
  LicenseStatus["LicenseGracePeriod"] = "LICENSE_GRACE_PERIOD";
  LicenseStatus["ActivationGracePeriod"] = "ACTIVATION_GRACE_PERIOD";
})(LicenseStatus || (LicenseStatus = {}));

var NeedIsMemberType;

(function (NeedIsMemberType) {
  NeedIsMemberType["All"] = "all";
  NeedIsMemberType["DirectOnly"] = "directOnly";
  NeedIsMemberType["None"] = "none";
})(NeedIsMemberType || (NeedIsMemberType = {}));

var ParticipationRole;

(function (ParticipationRole) {
  ParticipationRole["Req"] = "REQ";
  ParticipationRole["Opt"] = "OPT";
  ParticipationRole["Non"] = "NON";
})(ParticipationRole || (ParticipationRole = {}));

var ParticipationStatus;

(function (ParticipationStatus) {
  ParticipationStatus["Ne"] = "NE";
  ParticipationStatus["Ac"] = "AC";
  ParticipationStatus["Te"] = "TE";
  ParticipationStatus["De"] = "DE";
  ParticipationStatus["Dg"] = "DG";
  ParticipationStatus["Co"] = "CO";
  ParticipationStatus["In"] = "IN";
  ParticipationStatus["Wa"] = "WA";
  ParticipationStatus["Df"] = "DF";
})(ParticipationStatus || (ParticipationStatus = {}));

var PasswordRecoveryAddressStatus;

(function (PasswordRecoveryAddressStatus) {
  PasswordRecoveryAddressStatus["Verified"] = "verified";
  PasswordRecoveryAddressStatus["Pending"] = "pending";
})(PasswordRecoveryAddressStatus || (PasswordRecoveryAddressStatus = {}));

var PrefCalendarInitialView;

(function (PrefCalendarInitialView) {
  PrefCalendarInitialView["Day"] = "day";
  PrefCalendarInitialView["List"] = "list";
  PrefCalendarInitialView["Month"] = "month";
  PrefCalendarInitialView["Week"] = "week";
  PrefCalendarInitialView["WorkWeek"] = "workWeek";
  PrefCalendarInitialView["Year"] = "year";
})(PrefCalendarInitialView || (PrefCalendarInitialView = {}));

var PrefClientType;

(function (PrefClientType) {
  PrefClientType["Advanced"] = "advanced";
  PrefClientType["Modern"] = "modern";
  PrefClientType["Zimbrax"] = "zimbrax";
  PrefClientType["Standard"] = "standard";
})(PrefClientType || (PrefClientType = {}));

var PrefDelegatedSendSaveTarget;

(function (PrefDelegatedSendSaveTarget) {
  PrefDelegatedSendSaveTarget["Owner"] = "owner";
  PrefDelegatedSendSaveTarget["Sender"] = "sender";
  PrefDelegatedSendSaveTarget["Both"] = "both";
  PrefDelegatedSendSaveTarget["None"] = "none";
})(PrefDelegatedSendSaveTarget || (PrefDelegatedSendSaveTarget = {}));

var PrefMailSelectAfterDelete;

(function (PrefMailSelectAfterDelete) {
  PrefMailSelectAfterDelete["Next"] = "next";
  PrefMailSelectAfterDelete["Previous"] = "previous";
  PrefMailSelectAfterDelete["Adaptive"] = "adaptive";
})(PrefMailSelectAfterDelete || (PrefMailSelectAfterDelete = {}));

var PrefMailSendReadReceipts;

(function (PrefMailSendReadReceipts) {
  PrefMailSendReadReceipts["Prompt"] = "prompt";
  PrefMailSendReadReceipts["Always"] = "always";
  PrefMailSendReadReceipts["Never"] = "never";
})(PrefMailSendReadReceipts || (PrefMailSendReadReceipts = {}));

var ReadingPaneLocation;

(function (ReadingPaneLocation) {
  ReadingPaneLocation["Off"] = "off";
  ReadingPaneLocation["Right"] = "right";
  ReadingPaneLocation["Bottom"] = "bottom";
})(ReadingPaneLocation || (ReadingPaneLocation = {}));

var RecoverAccountOp;

(function (RecoverAccountOp) {
  RecoverAccountOp["GetRecoveryAccount"] = "getRecoveryAccount";
  RecoverAccountOp["SendRecoveryCode"] = "sendRecoveryCode";
})(RecoverAccountOp || (RecoverAccountOp = {}));

var ResetPasswordStatus;

(function (ResetPasswordStatus) {
  ResetPasswordStatus["Enabled"] = "enabled";
  ResetPasswordStatus["Disabled"] = "disabled";
  ResetPasswordStatus["Suspended"] = "suspended";
})(ResetPasswordStatus || (ResetPasswordStatus = {}));

var SearchType;

(function (SearchType) {
  SearchType["Conversation"] = "conversation";
  SearchType["Message"] = "message";
  SearchType["Contact"] = "contact";
  SearchType["Appointment"] = "appointment";
  SearchType["Task"] = "task";
  SearchType["Wiki"] = "wiki";
  SearchType["Document"] = "document";
})(SearchType || (SearchType = {}));

var SetRecoveryAccountChannel;

(function (SetRecoveryAccountChannel) {
  SetRecoveryAccountChannel["Email"] = "email";
})(SetRecoveryAccountChannel || (SetRecoveryAccountChannel = {}));

var SetRecoveryAccountOp;

(function (SetRecoveryAccountOp) {
  SetRecoveryAccountOp["SendCode"] = "sendCode";
  SetRecoveryAccountOp["ValidateCode"] = "validateCode";
  SetRecoveryAccountOp["ResendCode"] = "resendCode";
  SetRecoveryAccountOp["Reset"] = "reset";
})(SetRecoveryAccountOp || (SetRecoveryAccountOp = {}));

var ShareInputAction;

(function (ShareInputAction) {
  ShareInputAction["Edit"] = "edit";
  ShareInputAction["Revoke"] = "revoke";
  ShareInputAction["Expire"] = "expire";
})(ShareInputAction || (ShareInputAction = {}));

var SortBy;

(function (SortBy) {
  SortBy["None"] = "none";
  SortBy["DateAsc"] = "dateAsc";
  SortBy["DateDesc"] = "dateDesc";
  SortBy["SubjAsc"] = "subjAsc";
  SortBy["SubjDesc"] = "subjDesc";
  SortBy["NameAsc"] = "nameAsc";
  SortBy["NameDesc"] = "nameDesc";
  SortBy["RcptAsc"] = "rcptAsc";
  SortBy["RcptDesc"] = "rcptDesc";
  SortBy["AttachAsc"] = "attachAsc";
  SortBy["AttachDesc"] = "attachDesc";
  SortBy["FlagAsc"] = "flagAsc";
  SortBy["FlagDesc"] = "flagDesc";
  SortBy["PriorityAsc"] = "priorityAsc";
  SortBy["PriorityDesc"] = "priorityDesc";
  SortBy["ReadAsc"] = "readAsc";
  SortBy["ReadDesc"] = "readDesc";
  SortBy["SizeAsc"] = "sizeAsc";
  SortBy["SizeDesc"] = "sizeDesc";
})(SortBy || (SortBy = {}));

var Weekday;

(function (Weekday) {
  Weekday["Su"] = "SU";
  Weekday["Mo"] = "MO";
  Weekday["Tu"] = "TU";
  Weekday["We"] = "WE";
  Weekday["Th"] = "TH";
  Weekday["Fr"] = "FR";
  Weekday["Sa"] = "SA";
})(Weekday || (Weekday = {}));

var ZimletPresence;

(function (ZimletPresence) {
  ZimletPresence["Mandatory"] = "mandatory";
  ZimletPresence["Enabled"] = "enabled";
  ZimletPresence["Disabled"] = "disabled";
})(ZimletPresence || (ZimletPresence = {}));

function coerceBooleanToString(val) {
  if (val === true) {
    return 'TRUE';
  }

  if (val === false) {
    return 'FALSE';
  }

  return val;
}
function coerceStringToBoolean(val) {
  if (val === 'true' || val === 'TRUE') {
    return true;
  }

  if (val === 'false' || val === 'FALSE') {
    return false;
  }

  return val;
}
function coerceBooleanToInt(val) {
  if (val === true) {
    return 1;
  }

  if (val === false) {
    return 0;
  }

  return val;
}

function mapValuesDeep(obj, callback) {
  if (_typeof(obj) !== 'object') {
    return callback(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(function (v) {
      return mapValuesDeep(v, callback);
    });
  }

  return mapValues(obj, function (v) {
    return mapValuesDeep(v, callback);
  });
}

function setCustomMetaDataBody(data) {
  var attrs = data.attrs,
      id = data.id,
      section = data.section;
  var customMetaAttrs = [];
  forEach(attrs, function (_ref) {
    var key = _ref.key,
        value = _ref.value;
    return customMetaAttrs.push(_defineProperty({}, key, value));
  });
  return {
    id: id,
    meta: {
      section: section,
      _attrs: customMetaAttrs
    }
  };
}
function normalizeCustomMetaDataAttrs(data) {
  var attrs = [];
  Object.keys(data._attrs).forEach(function (key) {
    return typeof data._attrs[key] === 'string' && attrs.push({
      key: key,
      value: data._attrs[key]
    });
  });
  return _objectSpread2({}, data, {
    _attrs: attrs
  });
}

var Mapping;

(function (Mapping) {
  Mapping["f"] = "from";
  Mapping["t"] = "to";
  Mapping["c"] = "cc";
  Mapping["b"] = "bcc";
  Mapping["s"] = "sender";
})(Mapping || (Mapping = {}));

function parseAddress(address) {
  if (typeof address === 'string') {
    var parts = address.match(/(['"])(.*?)\1\s*<(.+)>/);

    if (parts) {
      return {
        address: parts[3],
        name: parts[2]
      };
    }

    return {
      address: address
    };
  }

  return address;
}
function normalizeEmailAddresses(message) {
  if (!message.emailAddresses) {
    return message;
  }

  for (var i = 0; i < message.emailAddresses.length; i++) {
    var sender = message.emailAddresses[i],
        type = sender.type,
        key = Mapping[type];
    (message[key] || (message[key] = [])).push(parseAddress(sender));
  }

  return message;
}

function normalizeCid(cid) {
  return cid.replace(/[<>]/g, '');
}

function normalizeType(contentType) {
  return String(contentType).replace(/^\s*(.*?)\s*;.+$/i, '$1').toLowerCase();
}

function normalizeDisposition(contentDisposition) {
  return normalizeType(contentDisposition);
}

function reduceMimeParts(obj, iterator, accumulator) {
  var parts = obj.mimeParts;

  if (parts && parts.length) {
    for (var i = 0; i < parts.length; i++) {
      accumulator = iterator(parts[i], i, accumulator);
      reduceMimeParts(parts[i], iterator, accumulator);
    }
  }

  return accumulator;
}

function getAttachmentUrl(attachment, _ref) {
  var _ref$origin = _ref.origin,
      origin = _ref$origin === void 0 ? '' : _ref$origin,
      jwtToken = _ref.jwtToken;
  var messageId = attachment.messageId,
      mid = attachment.mid,
      part = attachment.part;
  return "".concat(origin, "/service/home/~/?auth=").concat(jwtToken ? 'jwt' : 'co', "&id=").concat(encodeURIComponent(messageId || mid), "&part=").concat(encodeURIComponent(part)).concat(jwtToken ? "&zjwt=".concat(jwtToken) : '');
}
function getContactProfileImageUrl(attachment, _ref2) {
  var _ref2$origin = _ref2.origin,
      origin = _ref2$origin === void 0 ? '' : _ref2$origin,
      jwtToken = _ref2.jwtToken;
  var imageURL = getAttachmentUrl(attachment, {
    origin: origin,
    jwtToken: jwtToken
  });
  return imageURL ? "".concat(imageURL) : '';
}
function getProfileImageUrl(profileImageId, _ref3) {
  var _ref3$origin = _ref3.origin,
      origin = _ref3$origin === void 0 ? '' : _ref3$origin,
      jwtToken = _ref3.jwtToken;
  return "".concat(origin, "/service/home/~/?max_width=100&max_height=100&auth=").concat(jwtToken ? 'jwt' : 'co', "&id=").concat(encodeURIComponent(profileImageId)).concat(jwtToken ? "&zjwt=".concat(jwtToken) : '');
}
function normalizeMimeParts(message, _ref4) {
  var origin = _ref4.origin,
      jwtToken = _ref4.jwtToken;

  var processAttachment = function processAttachment(_ref5) {
    var attachment = _extends({}, _ref5);

    attachment.messageId = attachment.messageId || message.id;
    attachment.url = getAttachmentUrl(attachment, {
      origin: origin,
      jwtToken: jwtToken
    });
    attachment.contentId = attachment.contentId ? normalizeCid(attachment.contentId) : ~normalizeType(attachment.contentType).indexOf('image/') && attachment.contentDisposition === 'inline' ? "AUTO-GEN-CID-".concat(attachment.messageId, "-").concat(attachment.part, "-").concat(attachment.size) : undefined;
    return attachment;
  };

  reduceMimeParts(message, function (part, _, acc) {
    var isBody = false,
        type = normalizeType(part.contentType),
        disposition = normalizeDisposition(part.contentDisposition),
        content = part.content || '';
    if (isBody) acc.body = content;

    if (disposition !== 'attachment') {
      var bodyType = type === 'text/html' ? 'html' : type === 'text/plain' && 'text';

      if (~type.indexOf('image/') && disposition === 'inline' && !part.contentId) {
        var attachment = processAttachment(part);
        acc['text'] = (acc['text'] || acc['html'] || '').concat("<br /><div><img src=\"cid:".concat(attachment.contentId, "\" /></div><br />"));
        acc['html'] = acc['text'];
      } else if (part.filename && bodyType && disposition === 'inline') {
        (acc['inlineAttachments'] || (acc['inlineAttachments'] = [])).concat(processAttachment(part));
      } else if (bodyType && (!acc[bodyType] || disposition !== 'inline')) {
        if ((bodyType === 'html' || bodyType === 'text') && acc[bodyType]) {
          acc[bodyType] = acc[bodyType].concat(content);
        } else {
          acc[bodyType] = content;
        }

        isBody = true;
      }
    }

    if (!isBody && type.split('/')[0] !== 'multipart') {
      var mode = disposition === 'inline' ? 'inlineAttachments' : 'attachments';
      part.contentType !== 'application/pkcs7-mime' && part.contentType !== 'application/pkcs7-signature' && part.contentType !== 'application/x-pkcs7-signature' && (acc[mode] || (acc[mode] = [])).push(processAttachment(part));
      message.attributes = message.attributes || {};
      message.attributes.isEncrypted = part.contentType === 'application/pkcs7-mime';
      message.attributes.isSigned = part.contentType === 'application/pkcs7-signature' || part.contentType === 'application/x-pkcs7-signature';
    }

    return acc;
  }, message);
  message.autoSendTime = message.autoSendTime || null;
  return message;
}

var supportedContactAttributes = ['firstName', 'middleName', 'lastName', 'fullName', 'maidenName', 'namePrefix', 'nameSuffix', 'email', 'email2', 'workEmail', 'workEmail2', 'homeEmail', 'homeEmail2', 'phone', 'phone2', 'companyPhone', 'companyPhone2', 'otherPhone', 'otherPhone2', 'mobilePhone', 'mobilePhone2', 'homePhone', 'homePhone2', 'workPhone', 'workPhone2', 'pager', 'pager2', 'homeFax', 'homeFax2', 'workFax', 'workFax2', 'imAddress', 'imAddress1', 'imAddress2', 'imAddress3', 'imAddress4', 'imAddress5', 'nickname', 'homeStreet', 'homeCity', 'homeState', 'homePostalCode', 'homeCountry', 'homeURL', 'workStreet', 'workCity', 'workState', 'workPostalCode', 'workCountry', 'workURL', 'jobTitle', 'company', 'department', 'birthday', 'anniversary', 'website', 'notes', 'image', 'userCertificate', 'assistantPhone', 'callbackPhone', 'carPhone', 'otherCity', 'otherCountry', 'otherFax', 'otherPostalCode', 'otherState', 'otherStreet', 'otherURL', 'fileAs', 'type'];
function createContactBody(data) {
  var attributes = data.attributes,
      rest = _objectWithoutProperties(data, ["attributes"]);

  var contactAttrs = [];
  forEach(attributes, function (val, key) {
    return key !== 'other' ? contactAttrs.push(_defineProperty({
      name: key
    }, key === 'image' ? 'aid' : 'content', val)) : forEach(val, function (otherValue) {
      return contactAttrs.push({
        name: otherValue.key,
        _content: otherValue.value
      });
    });
  });
  return {
    cn: denormalize(ContactInputRequest)(_objectSpread2({}, rest, {
      attributes: contactAttrs
    }))
  };
}
function normalizeOtherAttr(data) {
  return data.map(function (contact) {
    var other = [];
    Object.keys(contact._attrs).filter(function (key) {
      return !supportedContactAttributes.includes(key);
    }).forEach(function (key) {
      return typeof contact._attrs[key] === 'string' && other.push({
        key: key,
        value: contact._attrs[key]
      }) && delete contact._attrs[key];
    });
    var otherAttributewithCustomKey = other.filter(function (o) {
      return o.key.match('custom\\d+');
    }).sort(function (a, b) {
      return Number(a.key.match(/(\d+)/g)[0]) - Number(b.key.match(/(\d+)/g)[0]);
    });
    var remainingOtherAttribute = differenceBy(other, otherAttributewithCustomKey, 'key').sort(function (a, b) {
      return a.key.localeCompare(b.key);
    });
    return _objectSpread2({}, contact, {
      _attrs: _objectSpread2({}, contact._attrs, {
        other: concat(otherAttributewithCustomKey, remainingOtherAttribute)
      })
    });
  });
}

var GalSearchType$1;

(function (GalSearchType) {
  GalSearchType["all"] = "all";
  GalSearchType["account"] = "account";
  GalSearchType["resource"] = "resource";
  GalSearchType["group"] = "group";
})(GalSearchType$1 || (GalSearchType$1 = {}));

var NeedIsMemberType$1;

(function (NeedIsMemberType) {
  NeedIsMemberType["all"] = "all";
  NeedIsMemberType["directOnly"] = "directOnly";
  NeedIsMemberType["none"] = "none";
})(NeedIsMemberType$1 || (NeedIsMemberType$1 = {}));

var ActionType;

(function (ActionType) {
  ActionType["contact"] = "ContactAction";
  ActionType["conversation"] = "ConvAction";
  ActionType["distributionList"] = "DistributionList";
  ActionType["folder"] = "FolderAction";
  ActionType["item"] = "ItemAction";
  ActionType["message"] = "MsgAction";
  ActionType["tag"] = "TagAction";
})(ActionType || (ActionType = {}));

var ActionResultType;

(function (ActionResultType) {
  ActionResultType["ConvAction"] = "Conversation";
  ActionResultType["MsgAction"] = "MessageInfo";
})(ActionResultType || (ActionResultType = {}));

var SetRecoveryAccountOpType;

(function (SetRecoveryAccountOpType) {
  SetRecoveryAccountOpType["send"] = "sendCode";
  SetRecoveryAccountOpType["validate"] = "validateCode";
  SetRecoveryAccountOpType["resend"] = "resendCode";
  SetRecoveryAccountOpType["reset"] = "reset";
})(SetRecoveryAccountOpType || (SetRecoveryAccountOpType = {}));

var SetRecoveryAccountChannelType;

(function (SetRecoveryAccountChannelType) {
  SetRecoveryAccountChannelType["email"] = "email";
})(SetRecoveryAccountChannelType || (SetRecoveryAccountChannelType = {}));

var RecoverAccountOpType;

(function (RecoverAccountOpType) {
  RecoverAccountOpType["get"] = "getRecoveryAccount";
  RecoverAccountOpType["send"] = "sendRecoveryCode";
})(RecoverAccountOpType || (RecoverAccountOpType = {}));

function normalizeMessage(message, _ref) {
  var origin = _ref.origin,
      jwtToken = _ref.jwtToken;
  var normalizedMessage = normalize(MessageInfo)(message);
  normalizedMessage.attributes = normalizedMessage.attributes && mapValuesDeep(normalizedMessage.attributes, coerceStringToBoolean);
  return normalizeEmailAddresses(normalizeMimeParts(normalizedMessage, {
    origin: origin,
    jwtToken: jwtToken
  }));
}

function updateAbsoluteFolderPath(originalName, parentFolderAbsPath, folders) {
  return folders.map(function (folder) {
    if (originalName === 'USER_ROOT') {
      folder.absFolderPath = "".concat(parentFolderAbsPath).concat(folder.absFolderPath);
    } else {
      folder.absFolderPath = folder.absFolderPath.replace("/".concat(originalName), parentFolderAbsPath);
    }

    if (folder.folders) {
      folder.folders = updateAbsoluteFolderPath(originalName, parentFolderAbsPath, folder.folders);
    }

    return folder;
  });
}

var ZimbraBatchClient = function ZimbraBatchClient() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, ZimbraBatchClient);

  this.notificationsEvents = {
    notify: 'notify'
  };

  this.accountInfo = function () {
    return _this.jsonRequest({
      name: 'GetInfo',
      namespace: Namespace.Account,
      body: {
        sections: 'mbox,attrs,zimlets,props'
      }
    }).then(function (res) {
      return _objectSpread2({}, res, {
        attrs: _objectSpread2({}, mapValuesDeep(res.attrs._attrs, coerceStringToBoolean), {
          zimbraMailAlias: [].concat(get(res, 'attrs._attrs.zimbraMailAlias', []))
        })
      }, get(res, 'license.attr') && {
        license: {
          status: res.license.status,
          attr: mapValuesDeep(res.license.attr, coerceStringToBoolean)
        }
      });
    });
  };

  this.action = function (type, options) {
    var ids = options.ids,
        id = options.id,
        rest = _objectWithoutProperties(options, ["ids", "id"]);

    return _this.jsonRequest({
      name: type,
      body: {
        action: _objectSpread2({
          id: id || (ids || []).join(',')
        }, denormalize(ActionOptions)(rest))
      },
      singleRequest: true
    }).then(Boolean);
  };

  this.addExternalAccount = function (_ref2) {
    var accountType = _ref2.accountType,
        accountInfo = _objectWithoutProperties(_ref2, ["accountType"]);

    return _this.jsonRequest({
      name: 'CreateDataSource',
      body: _defineProperty({}, accountType, mapValuesDeep(accountInfo, coerceBooleanToString)),
      singleRequest: true
    }).then(function (res) {
      return get(res, "".concat(accountType, ".0.id"));
    });
  };

  this.addMessage = function (options) {
    var _get = get(options, 'message'),
        folderId = _get.folderId,
        content = _get.content,
        meta = _get.meta;

    var flags, tags, tagNames, date;

    try {
      var _JSON$parse = JSON.parse(meta);

      flags = _JSON$parse.flags;
      tags = _JSON$parse.tags;
      tagNames = _JSON$parse.tagNames;
      date = _JSON$parse.date;
    } catch (err) {}

    return _this.jsonRequest({
      name: 'AddMsg',
      body: denormalize(AddMsgInfo)({
        message: {
          folderId: folderId,
          content: {
            _content: content
          },
          flags: flags,
          tags: tags,
          tagNames: tagNames,
          date: date
        }
      }),
      singleRequest: true
    }).then(normalize(MessageInfo));
  };

  this.applyFilterRules = function (_ref3) {
    var ids = _ref3.ids,
        filterRules = _ref3.filterRules;
    return _this.jsonRequest({
      name: 'ApplyFilterRules',
      body: {
        filterRules: {
          filterRule: filterRules
        },
        m: {
          ids: ids
        }
      }
    }).then(function (res) {
      var ids = get(res, 'm[0].ids');
      return ids ? ids.split(',') : [];
    });
  };

  this.autoComplete = function (options) {
    return _this.jsonRequest({
      name: 'AutoComplete',
      body: denormalize(AutoComplete)(options)
    }).then(normalize(AutoCompleteResponse));
  };

  this.autoCompleteGAL = function (options) {
    return _this.jsonRequest({
      name: 'AutoCompleteGal',
      namespace: Namespace.Account,
      body: options
    }).then(function (res) {
      return normalize(AutoCompleteGALResponse)(res);
    });
  };

  this.cancelTask = function (_ref4) {
    var inviteId = _ref4.inviteId;
    return _this.jsonRequest({
      name: 'CancelTask',
      body: {
        comp: '0',
        id: inviteId
      },
      singleRequest: true
    }).then(Boolean);
  };

  this.changeFolderColor = function (_ref5) {
    var id = _ref5.id,
        color = _ref5.color;
    return _this.action(ActionType.folder, {
      id: id,
      op: 'color',
      color: color
    });
  };

  this.changePassword = function (_ref6) {
    var loginNewPassword = _ref6.loginNewPassword,
        password = _ref6.password,
        username = _ref6.username;
    return _this.jsonRequest({
      name: 'ChangePassword',
      namespace: Namespace.Account,
      body: {
        account: {
          by: 'name',
          _content: username
        },
        oldPassword: password,
        password: loginNewPassword
      },
      singleRequest: true
    });
  };

  this.checkCalendar = function (_ref7) {
    var id = _ref7.id,
        value = _ref7.value;
    return _this.action(ActionType.folder, {
      id: id,
      op: value ? 'check' : '!check'
    });
  };

  this.clientInfo = function (_ref8) {
    var domain = _ref8.domain;
    return _this.jsonRequest({
      name: 'ClientInfo',
      body: {
        domain: [{
          by: 'name',
          _content: domain
        }]
      },
      singleRequest: true,
      namespace: Namespace.Account
    }).then(function (res) {
      return normalize(ClientInfoResponse)(res);
    });
  };

  this.contactAction = function (options) {
    return _this.action(ActionType.contact, options);
  };

  this.conversationAction = function (options) {
    return _this.action(ActionType.conversation, options);
  };

  this.counterAppointment = function (body) {
    return _this.jsonRequest({
      name: 'CounterAppointment',
      body: denormalize(CounterAppointmentInfo)(body),
      singleRequest: true
    }).then(Boolean);
  };

  this.createAppointment = function (accountName, appointment) {
    return _this.jsonRequest({
      name: 'CreateAppointment',
      body: _objectSpread2({}, denormalize(CalendarItemCreateModifyRequest)(appointment)),
      accountName: accountName,
      singleRequest: true
    }).then(Boolean);
  };

  this.createAppointmentException = function (accountName, appointment) {
    return _this.jsonRequest({
      name: 'CreateAppointmentException',
      body: _objectSpread2({}, denormalize(CalendarItemCreateModifyRequest)(appointment)),
      accountName: accountName,
      singleRequest: true
    }).then(Boolean);
  };

  this.createAppSpecificPassword = function (appName) {
    return _this.jsonRequest({
      name: 'CreateAppSpecificPassword',
      namespace: Namespace.Account,
      body: {
        appName: {
          _content: appName
        }
      },
      singleRequest: true
    }).then(function (res) {
      return normalize(CreateAppSpecificPasswordResponse)(res);
    });
  };

  this.createContact = function (data) {
    return _this.jsonRequest({
      name: 'CreateContact',
      body: createContactBody(data),
      singleRequest: true
    }).then(function (res) {
      return normalize(Contact)(normalizeOtherAttr(res.cn)[0]);
    });
  };

  this.createFolder = function (_options) {
    var flags = _options.flags,
        fetchIfExists = _options.fetchIfExists,
        parentFolderId = _options.parentFolderId,
        options = _objectWithoutProperties(_options, ["flags", "fetchIfExists", "parentFolderId"]);

    return _this.jsonRequest({
      name: 'CreateFolder',
      body: {
        folder: _objectSpread2({}, options, {
          f: flags,
          fie: fetchIfExists,
          l: parentFolderId
        })
      },
      singleRequest: true
    }).then(function (res) {
      return normalize(Folder)(res.folder[0]);
    });
  };

  this.createIdentity = function (_ref9) {
    var attrs = _ref9.attrs,
        rest = _objectWithoutProperties(_ref9, ["attrs"]);

    return _this.jsonRequest({
      name: 'CreateIdentity',
      namespace: Namespace.Account,
      body: {
        identity: _objectSpread2({}, rest, {
          _attrs: mapValues(attrs, coerceBooleanToString)
        })
      },
      singleRequest: true
    }).then(function (res) {
      return mapValuesDeep(res, coerceStringToBoolean);
    });
  };

  this.createMountpoint = function (_options) {
    return _this.jsonRequest({
      name: 'CreateMountpoint',
      body: denormalize(CreateMountpointRequest)(_options),
      singleRequest: true
    }).then(Boolean);
  };

  this.createSearchFolder = function (_options) {
    var parentFolderId = _options.parentFolderId,
        options = _objectWithoutProperties(_options, ["parentFolderId"]);

    return _this.jsonRequest({
      name: 'CreateSearchFolder',
      body: {
        search: _objectSpread2({}, options, {
          l: parentFolderId
        })
      },
      singleRequest: true
    }).then(function (res) {
      return normalize(Folder)(res.search[0]);
    });
  };

  this.createSignature = function (options) {
    return _this.jsonRequest({
      name: 'CreateSignature',
      namespace: Namespace.Account,
      body: denormalize(CreateSignatureRequest)(options),
      singleRequest: true
    });
  };

  this.createTag = function (tag) {
    return _this.jsonRequest({
      name: 'CreateTag',
      body: {
        tag: _objectSpread2({}, tag)
      },
      singleRequest: true
    }).then(function (_ref10) {
      var _ref10$tag = _ref10.tag,
          tag = _ref10$tag === void 0 ? [] : _ref10$tag;
      return normalize(Tag)(tag[0]);
    });
  };

  this.createTask = function (task) {
    return _this.jsonRequest({
      name: 'CreateTask',
      body: _objectSpread2({}, denormalize(CalendarItemCreateModifyRequest)(task)),
      singleRequest: true
    }).then(Boolean);
  };

  this.declineCounterAppointment = function (body) {
    return _this.jsonRequest({
      name: 'DeclineCounterAppointment',
      body: denormalize(CounterAppointmentInfo)(body),
      singleRequest: true
    }).then(Boolean);
  };

  this.deleteAppointment = function (appointment) {
    return _this.jsonRequest({
      name: 'CancelAppointment',
      body: denormalize(CalendarItemDeleteRequest)(appointment),
      singleRequest: true
    }).then(Boolean);
  };

  this.deleteExternalAccount = function (_ref11) {
    var id = _ref11.id;
    return _this.jsonRequest({
      name: 'DeleteDataSource',
      body: {
        dsrc: {
          id: id
        }
      },
      singleRequest: true
    }).then(Boolean);
  };

  this.deleteIdentity = function (identity) {
    return _this.jsonRequest({
      name: 'DeleteIdentity',
      namespace: Namespace.Account,
      body: {
        identity: identity
      },
      singleRequest: true
    }).then(Boolean);
  };

  this.deleteSignature = function (options) {
    return _this.jsonRequest({
      name: 'DeleteSignature',
      namespace: Namespace.Account,
      body: options,
      singleRequest: true
    }).then(Boolean);
  };

  this.disableTwoFactorAuth = function () {
    return _this.jsonRequest({
      name: 'DisableTwoFactorAuth',
      namespace: Namespace.Account,
      singleRequest: true
    }).then(Boolean);
  };

  this.discoverRights = function () {
    return _this.jsonRequest({
      name: 'DiscoverRights',
      namespace: Namespace.Account,
      body: {
        right: [{
          _content: 'sendAs'
        }, {
          _content: 'sendOnBehalfOf'
        }]
      }
    }).then(function (res) {
      return normalize(DiscoverRightsResponse)(res);
    });
  };

  this.dismissCalendarItem = function (appointment, task) {
    return _this.jsonRequest({
      name: 'DismissCalendarItemAlarm',
      body: {
        appt: appointment,
        task: task
      },
      singleRequest: true
    }).then(Boolean);
  };

  this.downloadAttachment = function (_ref12) {
    var id = _ref12.id,
        part = _ref12.part;
    return _this.download({
      id: id,
      part: part
    }).then(function (_ref13) {
      var id = _ref13.id,
          part = _ref13.part,
          content = _ref13.content;
      return {
        id: "".concat(id, "_").concat(part),
        content: content
      };
    });
  };

  this.downloadMessage = function (_ref14) {
    var id = _ref14.id,
        isSecure = _ref14.isSecure;
    return _this.download({
      id: id,
      isSecure: isSecure
    }).then(function (_ref15) {
      var id = _ref15.id,
          content = _ref15.content;
      return {
        id: id,
        content: content
      };
    });
  };

  this.enableTwoFactorAuth = function (_ref16) {
    var name = _ref16.name,
        password = _ref16.password,
        authToken = _ref16.authToken,
        twoFactorCode = _ref16.twoFactorCode,
        csrfTokenSecured = _ref16.csrfTokenSecured;
    return _this.jsonRequest({
      name: 'EnableTwoFactorAuth',
      body: _objectSpread2({
        name: {
          _content: name
        }
      }, password && {
        password: {
          _content: password
        }
      }, {}, authToken && {
        authToken: {
          _content: authToken
        }
      }, {}, twoFactorCode && {
        twoFactorCode: {
          _content: twoFactorCode
        }
      }, {
        csrfTokenSecured: csrfTokenSecured
      }),
      namespace: Namespace.Account,
      singleRequest: true
    });
  };

  this.folderAction = function (options) {
    return _this.action(ActionType.folder, options);
  };

  this.forwardAppointment = function (body) {
    return _this.jsonRequest({
      name: 'ForwardAppointment',
      body: denormalize(ForwardAppointmentInfo)(body),
      singleRequest: true
    }).then(Boolean);
  };

  this.forwardAppointmentInvite = function (body) {
    return _this.jsonRequest({
      name: 'ForwardAppointmentInvite',
      body: denormalize(ForwardAppointmentInviteInfo)(body),
      singleRequest: true
    }).then(Boolean);
  };

  this.freeBusy = function (_ref17) {
    var start = _ref17.start,
        end = _ref17.end,
        names = _ref17.names;
    return _this.jsonRequest({
      name: 'GetFreeBusy',
      body: {
        s: start,
        e: end,
        name: names.join(',')
      }
    }).then(function (res) {
      return normalize(FreeBusy)(res.usr);
    });
  };

  this.generateScratchCodes = function (username) {
    return _this.jsonRequest({
      name: 'GenerateScratchCodes',
      namespace: Namespace.Account,
      body: {
        account: {
          by: 'name',
          _content: username
        }
      },
      singleRequest: true
    });
  };

  this.getAppointment = function (options) {
    return _this.jsonRequest({
      name: 'GetAppointment',
      body: options
    }).then(function (res) {
      return normalize(GetAppointmentResponse)(res);
    });
  };

  this.getAppSpecificPasswords = function () {
    return _this.jsonRequest({
      name: 'GetAppSpecificPasswords',
      namespace: Namespace.Account
    });
  };

  this.getAttachmentUrl = function (attachment) {
    return getAttachmentUrl(attachment, {
      origin: _this.origin,
      jwtToken: _this.jwtToken
    });
  };

  this.getAvailableLocales = function () {
    return _this.jsonRequest({
      name: 'GetAvailableLocales',
      namespace: Namespace.Account
    }).then(function (res) {
      return res.locale;
    });
  };

  this.getContact = function (_ref18) {
    var id = _ref18.id,
        ids = _ref18.ids,
        rest = _objectWithoutProperties(_ref18, ["id", "ids"]);

    return _this.jsonRequest({
      name: 'GetContacts',
      body: _objectSpread2({
        cn: {
          id: id || (ids || []).join(',')
        }
      }, rest)
    }).then(function (res) {
      return res.cn.map(function (contact) {
        return normalize(Contact)(contact);
      });
    });
  };

  this.getContactFrequency = function (options) {
    return _this.jsonRequest({
      name: 'GetContactFrequency',
      body: options
    }).then(function (res) {
      res.data = res.data.map(function (item) {
        item.by = item.spec[0].range;
        return item;
      });
      return res;
    });
  };

  this.getContactProfileImageUrl = function (attachment) {
    return getContactProfileImageUrl(attachment, {
      origin: _this.origin,
      jwtToken: _this.jwtToken
    });
  };

  this.getConversation = function (options) {
    return _this.jsonRequest({
      name: 'GetConv',
      body: {
        c: mapValues(options, coerceBooleanToInt)
      }
    }).then(function (res) {
      var c = normalize(Conversation)(res.c[0]);
      c.messages = c.messages.map(_this.normalizeMessage);
      return c;
    });
  };

  this.getCustomMetadata = function (_ref19) {
    var id = _ref19.id,
        section = _ref19.section;
    return _this.jsonRequest({
      name: 'GetCustomMetadata',
      body: {
        id: id,
        meta: {
          section: section
        }
      }
    }).then(function (res) {
      if (res.meta) {
        res.meta = res.meta.map(function (entry) {
          if (!entry._attrs) {
            entry._attrs = {};
          }

          entry = normalizeCustomMetaDataAttrs(entry);
          return entry;
        });
      }

      return mapValuesDeep(res, coerceStringToBoolean);
    });
  };

  this.getDataSources = function () {
    return _this.jsonRequest({
      name: 'GetDataSources'
    }).then(function (res) {
      return mapValuesDeep(res, coerceStringToBoolean);
    });
  };

  this.getFilterRules = function () {
    return _this.jsonRequest({
      name: 'GetFilterRules'
    }).then(function (res) {
      return normalize(Filter)(get(res, 'filterRules.0.filterRule') || []);
    });
  };

  this.getFolder = function (options) {
    return _this.jsonRequest({
      name: 'GetFolder',
      body: denormalize(GetFolderRequest)(options)
    }).then(function (res) {
      var foldersResponse = normalize(Folder)(res);
      var folders = get(foldersResponse, 'folders.0', {});

      if (folders.linkedFolders) {
        folders.linkedFolders = folders.linkedFolders.map(function (folder) {
          if (!folder.view || folder.view === FolderView.Message || folder.view === FolderView.Contact || folder.view === FolderView.Document) {
            var absFolderPath = folder.absFolderPath,
                oname = folder.oname,
                _folders = folder.folders,
                ownerZimbraId = folder.ownerZimbraId,
                sharedItemId = folder.sharedItemId;

            if (folder.view === FolderView.Contact) {
              folder.userId = folder.id, folder.id = "".concat(ownerZimbraId, ":").concat(sharedItemId);
            }

            if (oname && _folders) {
              folder.folders = updateAbsoluteFolderPath(oname, absFolderPath, _folders);
            }
          }

          return folder;
        });
      }

      return foldersResponse;
    });
  };

  this.getIdentities = function () {
    return _this.jsonRequest({
      name: 'GetIdentities',
      namespace: Namespace.Account
    }).then(function (res) {
      return mapValuesDeep(res, coerceStringToBoolean);
    });
  };

  this.getMailboxMetadata = function (_ref20) {
    var section = _ref20.section;
    return _this.jsonRequest({
      name: 'GetMailboxMetadata',
      body: {
        meta: {
          section: section
        }
      }
    }).then(function (res) {
      res.meta = res.meta.map(function (entry) {
        if (!entry._attrs) entry._attrs = {};
        return entry;
      });
      return mapValuesDeep(res, coerceStringToBoolean);
    });
  };

  this.getMessage = function (_ref21) {
    var id = _ref21.id,
        html = _ref21.html,
        raw = _ref21.raw,
        header = _ref21.header,
        read = _ref21.read,
        max = _ref21.max,
        ridZ = _ref21.ridZ;
    return _this.jsonRequest({
      name: 'GetMsg',
      body: {
        m: _objectSpread2({
          id: id,
          html: html !== false && raw !== true ? 1 : 0,
          header: header,
          read: read === true ? 1 : undefined,
          needExp: 1,
          neuter: 0,
          max: max || 250000,
          raw: raw ? 1 : 0
        }, ridZ && {
          ridZ: ridZ
        })
      }
    }).then(function (res) {
      return res && res.m ? _this.normalizeMessage(res.m[0]) : null;
    });
  };

  this.getMessagesMetadata = function (_ref22) {
    var ids = _ref22.ids;
    return _this.jsonRequest({
      name: 'GetMsgMetadata',
      body: {
        m: {
          ids: ids.join(',')
        }
      }
    }).then(function (res) {
      return res.m.map(_this.normalizeMessage);
    });
  };

  this.getPreferences = function () {
    return _this.jsonRequest({
      name: 'GetPrefs',
      namespace: Namespace.Account
    }).then(function (res) {
      var prefs = mapValuesDeep(res._attrs, coerceStringToBoolean);
      prefs.zimbraPrefMailTrustedSenderList = typeof prefs.zimbraPrefMailTrustedSenderList === 'string' ? castArray(prefs.zimbraPrefMailTrustedSenderList) : prefs.zimbraPrefMailTrustedSenderList;
      return prefs;
    });
  };

  this.getProfileImageUrl = function (profileImageId) {
    return getProfileImageUrl(profileImageId, {
      origin: _this.origin,
      jwtToken: _this.jwtToken
    });
  };

  this.getRights = function (options) {
    return _this.jsonRequest({
      name: 'GetRights',
      namespace: Namespace.Account,
      body: denormalize(GetRightsRequest)(options)
    }).then(normalize(AccountRights));
  };

  this.getScratchCodes = function (username) {
    return _this.jsonRequest({
      name: 'GetScratchCodes',
      namespace: Namespace.Account,
      body: {
        account: {
          by: 'name',
          _content: username
        }
      }
    });
  };

  this.getSearchFolder = function () {
    return _this.jsonRequest({
      name: 'GetSearchFolder'
    }).then(function (res) {
      return res.search ? {
        folders: normalize(Folder)(res.search)
      } : {};
    });
  };

  this.getSignatures = function () {
    return _this.jsonRequest({
      name: 'GetSignatures',
      namespace: Namespace.Account
    }).then(function (res) {
      return mapValuesDeep(res, coerceStringToBoolean);
    });
  };

  this.getSMimePublicCerts = function (options) {
    return _this.jsonRequest({
      name: 'GetSMIMEPublicCerts',
      body: {
        store: {
          _content: options.store
        },
        email: {
          _content: options.contactAddr
        }
      },
      namespace: Namespace.Account
    });
  };

  this.getTag = function () {
    return _this.jsonRequest({
      name: 'GetTag',
      namespace: Namespace.Mail
    }).then(function (_ref23) {
      var _ref23$tag = _ref23.tag,
          tag = _ref23$tag === void 0 ? [] : _ref23$tag;
      return tag.map(normalize(Tag));
    });
  };

  this.getTasks = function (options) {
    return _this.jsonRequest({
      name: 'Search',
      body: _objectSpread2({}, options)
    }).then(function (res) {
      if (res.cn) {
        res.cn = normalizeOtherAttr(res.cn);
      }

      var normalized = normalize(SearchResponse)(res);
      return _objectSpread2({}, normalized, {
        tasks: normalized.task ? normalized.task.map(normalize(CalendarItemHitInfo)) : []
      });
    });
  };

  this.getTrustedDevices = function () {
    return _this.jsonRequest({
      name: 'GetTrustedDevices',
      namespace: Namespace.Account
    });
  };

  this.getWhiteBlackList = function () {
    return _this.jsonRequest({
      name: 'GetWhiteBlackList',
      namespace: Namespace.Account
    });
  };

  this.getWorkingHours = function (_ref24) {
    var start = _ref24.start,
        end = _ref24.end,
        names = _ref24.names;
    return _this.jsonRequest({
      name: 'GetWorkingHours',
      body: _objectSpread2({
        name: names.join(',')
      }, denormalize(FreeBusyInstance)({
        start: start,
        end: end
      }))
    }).then(function (res) {
      return normalize(FreeBusy)(res.usr);
    });
  };

  this.grantRights = function (body) {
    return _this.jsonRequest({
      name: 'GrantRights',
      namespace: Namespace.Account,
      body: denormalize(AccountRights)(body)
    }).then(normalize(AccountRights));
  };

  this.importExternalAccount = function (_ref25) {
    var accountType = _ref25.accountType,
        id = _ref25.id;
    return _this.jsonRequest({
      name: 'ImportData',
      body: _defineProperty({}, accountType, {
        id: id
      })
    }).then(Boolean);
  };

  this.itemAction = function (options) {
    return _this.action(ActionType.item, options);
  };

  this.jsonRequest = function (options) {
    return _this[options.singleRequest ? 'dataLoader' : 'batchDataLoader'].load(options);
  };

  this.login = function (_ref26) {
    var username = _ref26.username,
        password = _ref26.password,
        recoveryCode = _ref26.recoveryCode,
        tokenType = _ref26.tokenType,
        _ref26$persistAuthTok = _ref26.persistAuthTokenCookie,
        persistAuthTokenCookie = _ref26$persistAuthTok === void 0 ? true : _ref26$persistAuthTok,
        twoFactorCode = _ref26.twoFactorCode,
        deviceTrusted = _ref26.deviceTrusted,
        csrfTokenSecured = _ref26.csrfTokenSecured;
    return _this.jsonRequest({
      name: 'Auth',
      singleRequest: true,
      body: _objectSpread2({
        tokenType: tokenType,
        csrfTokenSecured: csrfTokenSecured,
        persistAuthTokenCookie: persistAuthTokenCookie,
        account: {
          by: 'name',
          _content: username
        }
      }, password && {
        password: password
      }, {}, recoveryCode && {
        recoveryCode: {
          verifyAccount: true,
          _content: recoveryCode
        }
      }, {}, twoFactorCode && {
        twoFactorCode: twoFactorCode
      }, {}, deviceTrusted && {
        deviceTrusted: deviceTrusted
      }),
      namespace: Namespace.Account
    }).then(function (res) {
      return mapValuesDeep(res, coerceStringToBoolean);
    });
  };

  this.logout = function () {
    return _this.jsonRequest({
      name: 'EndSession',
      body: {
        logoff: true
      },
      namespace: Namespace.Account
    }).then(Boolean);
  };

  this.messageAction = function (options) {
    return _this.action(ActionType.message, options);
  };

  this.modifyAppointment = function (accountName, appointment) {
    return _this.jsonRequest({
      name: 'ModifyAppointment',
      body: _objectSpread2({}, denormalize(CalendarItemCreateModifyRequest)(appointment)),
      accountName: accountName,
      singleRequest: true
    }).then(function (res) {
      return normalize(CalendarItemCreateModifyRequest)(res);
    });
  };

  this.modifyContact = function (data) {
    return _this.jsonRequest({
      name: 'ModifyContact',
      body: createContactBody(data),
      singleRequest: true
    }).then(function (res) {
      return normalize(Contact)(normalizeOtherAttr(res.cn)[0]);
    });
  };

  this.modifyExternalAccount = function (_ref27) {
    var id = _ref27.id,
        accountType = _ref27.type,
        attrs = _ref27.attrs;
    return _this.jsonRequest({
      name: 'ModifyDataSource',
      body: _defineProperty({}, accountType, _objectSpread2({
        id: id
      }, mapValuesDeep(attrs, coerceBooleanToString))),
      singleRequest: true
    }).then(Boolean);
  };

  this.modifyFilterRules = function (filters) {
    return _this.jsonRequest({
      name: 'ModifyFilterRules',
      body: {
        filterRules: [{
          filterRule: denormalize(Filter)(filters)
        }]
      },
      singleRequest: true
    }).then(Boolean);
  };

  this.modifyIdentity = function (_ref28) {
    var attrs = _ref28.attrs,
        rest = _objectWithoutProperties(_ref28, ["attrs"]);

    return _this.jsonRequest({
      name: 'ModifyIdentity',
      namespace: Namespace.Account,
      body: {
        identity: _objectSpread2({}, rest, {
          _attrs: mapValues(attrs, coerceBooleanToString)
        })
      },
      singleRequest: true
    });
  };

  this.modifyPrefs = function (prefs) {
    return _this.jsonRequest({
      name: 'ModifyPrefs',
      namespace: Namespace.Account,
      body: {
        _attrs: mapValuesDeep(prefs, coerceBooleanToString)
      },
      singleRequest: true
    }).then(Boolean);
  };

  this.modifyProfileImage = function (_ref29) {
    var content = _ref29.content,
        contentType = _ref29.contentType;
    return _this.jsonRequest({
      name: 'ModifyProfileImage',
      body: {
        _content: content
      },
      singleRequest: true,
      headers: {
        'Content-Type': contentType && contentType
      }
    });
  };

  this.modifyProps = function (props) {
    return _this.jsonRequest({
      name: 'ModifyProperties',
      namespace: Namespace.Account,
      body: {
        prop: mapValuesDeep(props, coerceBooleanToString)
      },
      singleRequest: true
    }).then(Boolean);
  };

  this.modifySearchFolder = function (options) {
    return _this.jsonRequest({
      name: 'ModifySearchFolder',
      body: options,
      singleRequest: true
    }).then(Boolean);
  };

  this.modifySignature = function (options) {
    return _this.jsonRequest({
      name: 'ModifySignature',
      namespace: Namespace.Account,
      body: denormalize(CreateSignatureRequest)(options),
      singleRequest: true
    }).then(Boolean);
  };

  this.modifyTask = function (task) {
    return _this.jsonRequest({
      name: 'ModifyTask',
      body: _objectSpread2({}, denormalize(CalendarItemCreateModifyRequest)(task)),
      singleRequest: true
    }).then(Boolean);
  };

  this.modifyWhiteBlackList = function (whiteBlackList) {
    return _this.jsonRequest({
      name: 'ModifyWhiteBlackList',
      namespace: Namespace.Account,
      body: _objectSpread2({}, whiteBlackList),
      singleRequest: true
    }).then(Boolean);
  };

  this.modifyZimletPrefs = function (zimlet) {
    return _this.jsonRequest({
      name: 'ModifyZimletPrefs',
      namespace: Namespace.Account,
      body: {
        zimlet: zimlet
      },
      singleRequest: true
    });
  };

  this.noop = function () {
    return _this.jsonRequest({
      name: 'NoOp'
    }).then(Boolean);
  };

  this.recoverAccount = function (_ref30) {
    var channel = _ref30.channel,
        email = _ref30.email,
        op = _ref30.op;
    return _this.jsonRequest({
      name: 'RecoverAccount',
      body: {
        channel: channel,
        email: email,
        op: op
      }
    });
  };

  this.relatedContacts = function (_ref31) {
    var email = _ref31.email;
    return _this.jsonRequest({
      name: 'GetRelatedContacts',
      body: {
        targetContact: {
          cn: email
        }
      }
    }).then(function (resp) {
      return resp.relatedContacts.relatedContact;
    });
  };

  this.resetPassword = function (_ref32) {
    var password = _ref32.password;
    return _this.jsonRequest({
      name: 'ResetPassword',
      namespace: Namespace.Account,
      body: {
        password: password
      },
      singleRequest: true
    }).then(function () {
      return true;
    });
  };

  this.resolve = function (path) {
    return "".concat(_this.origin).concat(path);
  };

  this.revokeAppSpecificPassword = function (appName) {
    return _this.jsonRequest({
      name: 'RevokeAppSpecificPassword',
      namespace: Namespace.Account,
      body: {
        appName: appName
      },
      singleRequest: true
    }).then(Boolean);
  };

  this.revokeOtherTrustedDevices = function () {
    return _this.jsonRequest({
      name: 'RevokeOtherTrustedDevices',
      namespace: Namespace.Account,
      singleRequest: true
    }).then(Boolean);
  };

  this.revokeRights = function (body) {
    return _this.jsonRequest({
      name: 'RevokeRights',
      namespace: Namespace.Account,
      body: denormalize(AccountRights)(body),
      singleRequest: true
    }).then(normalize(AccountRights));
  };

  this.revokeTrustedDevice = function () {
    return _this.jsonRequest({
      name: 'RevokeTrustedDevice',
      namespace: Namespace.Account,
      singleRequest: true
    }).then(Boolean);
  };

  this.saveDocument = function (document) {
    return _this.jsonRequest({
      name: 'SaveDocument',
      body: denormalize(SaveDocuments)(document),
      singleRequest: true
    }).then(Boolean);
  };

  this.saveDraft = function (options) {
    return _this.jsonRequest({
      name: 'SaveDraft',
      body: denormalize(SendMessageInfo)(options),
      singleRequest: true
    }).then(function (_ref33) {
      var messages = _ref33.m;
      return {
        message: messages && messages.map(_this.normalizeMessage)
      };
    });
  };

  this.search = function (options) {
    return _this.jsonRequest({
      name: 'Search',
      body: _objectSpread2({}, options)
    }).then(function (res) {
      if (res.cn) {
        res.cn = normalizeOtherAttr(res.cn);
      }

      var normalized = normalize(SearchResponse)(res);

      if (normalized.messages) {
        normalized.messages = normalized.messages.map(_this.normalizeMessage);
      }

      return normalized;
    });
  };

  this.searchGal = function (options) {
    return _this.jsonRequest({
      name: 'SearchGal',
      body: options,
      namespace: Namespace.Account
    }).then(normalize(SearchResponse));
  };

  this.sendDeliveryReport = function (messageId) {
    return _this.jsonRequest({
      name: 'SendDeliveryReport',
      body: {
        mid: messageId
      },
      singleRequest: true
    }).then(Boolean);
  };

  this.sendInviteReply = function (requestOptions) {
    return _this.jsonRequest({
      name: 'SendInviteReply',
      body: _objectSpread2({}, denormalize(InviteReply)(requestOptions)),
      singleRequest: true
    }).then(function (res) {
      return normalize(CalendarItemHitInfo)(res);
    });
  };

  this.sendMessage = function (body) {
    return _this.jsonRequest({
      name: 'SendMsg',
      body: denormalize(SendMessageInfo)(body),
      singleRequest: true
    }).then(normalize(SendMessageInfo));
  };

  this.sendShareNotification = function (body) {
    return _this.jsonRequest({
      name: 'SendShareNotification',
      body: _objectSpread2({}, denormalize(ShareNotification)(body)),
      singleRequest: true
    }).then(Boolean);
  };

  this.setCsrfToken = function (csrfToken) {
    _this.csrfToken = csrfToken;
  };

  this.setCustomMetadata = function (variables) {
    return _this.jsonRequest({
      name: 'SetCustomMetadata',
      body: setCustomMetaDataBody(variables.customMetaData)
    }).then(Boolean);
  };

  this.setJwtToken = function (jwtToken) {
    _this.jwtToken = jwtToken;
  };

  this.setRecoveryAccount = function (options) {
    return _this.jsonRequest({
      name: 'SetRecoveryAccount',
      body: options,
      singleRequest: true
    }).then(Boolean);
  };

  this.setUserAgent = function (userAgent) {
    _this.userAgent = userAgent;
  };

  this.shareInfo = function (options) {
    return _this.jsonRequest({
      name: 'GetShareInfo',
      body: _objectSpread2({}, options, {
        _jsns: 'urn:zimbraAccount'
      })
    }).then(function (res) {
      return res.share;
    });
  };

  this.snoozeCalendarItem = function (appointment, task) {
    return _this.jsonRequest({
      name: 'SnoozeCalendarItemAlarm',
      body: {
        appt: appointment,
        task: task
      },
      singleRequest: true
    }).then(Boolean);
  };

  this.taskFolders = function () {
    return _this.jsonRequest({
      name: 'GetFolder',
      body: {
        view: FolderView.Task,
        tr: true
      }
    }).then(function (res) {
      return normalize(Folder)(res.folder[0].folder);
    });
  };

  this.testExternalAccount = function (_ref34) {
    var accountType = _ref34.accountType,
        accountInfo = _objectWithoutProperties(_ref34, ["accountType"]);

    return _this.jsonRequest({
      name: 'TestDataSource',
      body: _defineProperty({}, accountType, mapValuesDeep(accountInfo, coerceBooleanToString)),
      singleRequest: true
    }).then(function (res) {
      return mapValuesDeep(get(res, "".concat(accountType, ".0")), coerceStringToBoolean);
    });
  };

  this.uploadMessage = function (message) {
    var contentDisposition = 'attachment';
    var filename = 'message.eml';
    var contentType = 'message/rfc822';
    return fetch("".concat(_this.origin, "/service/upload?fmt=raw"), {
      method: 'POST',
      body: message,
      headers: _objectSpread2({
        'Content-Disposition': "".concat(contentDisposition, "; filename=\"").concat(filename, "\""),
        'Content-Type': contentType
      }, _this.csrfToken && {
        'X-Zimbra-Csrf-Token': _this.csrfToken
      }),
      credentials: 'include'
    }).then(function (response) {
      if (response.ok) {
        return response.text().then(function (result) {
          if (!result) {
            return null;
          }

          var _ref35 = result.match(/^([^,]+),([^,]+),'(.*)'/) || [],
              _ref36 = _slicedToArray(_ref35, 4),
              _ref36$ = _ref36[1],
              status = _ref36$ === void 0 ? '' : _ref36$,
              _ref36$2 = _ref36[2],
              err = _ref36$2 === void 0 ? undefined : _ref36$2,
              _ref36$3 = _ref36[3],
              aid = _ref36$3 === void 0 ? '' : _ref36$3;

          if (err && err !== "'null'") {
            return null;
          }

          if (+status === 200) {
            return aid;
          }
        });
      }
    });
  };

  this.batchDataHandler = function (requests) {
    return batchJsonRequest(_objectSpread2({
      requests: requests
    }, _this.getAdditionalRequestOptions())).then(function (response) {
      var sessionId = get(response, 'header.context.session.id');
      var notifications = get(response, 'header.context.notify.0');

      _this.checkAndUpdateSessionId(sessionId);

      if (notifications && _this.notificationsEmitter) {
        _this.notificationsEmitter && _this.notificationsEmitter.emit(_this.notificationsEvents.notify, notifications);
      }

      return response.requests.map(function (r, i) {

        return isError(r) ? r : r.body;
      });
    });
  };

  this.checkAndUpdateSessionId = function (sessionId) {
    if (sessionId && _this.sessionId !== sessionId) {
      _this.sessionHandler && _this.sessionHandler.writeSessionId(sessionId);
      _this.sessionId = sessionId;
    }
  };

  this.dataHandler = function (requests) {
    return jsonRequest(_objectSpread2({}, requests[0], {}, _this.getAdditionalRequestOptions(requests[0].name !== 'Auth'))).then(function (response) {
      var sessionId = get(response, 'header.context.session.id');
      var notifications = get(response, 'header.context.notify.0');

      _this.checkAndUpdateSessionId(sessionId);

      if (notifications && _this.notificationsEmitter) {
        _this.notificationsEmitter.emit(_this.notificationsEvents.notify, notifications);
      }

      return isError(response) ? [response] : [response.body];
    });
  };

  this.download = function (_ref37) {
    var id = _ref37.id,
        part = _ref37.part,
        isSecure = _ref37.isSecure;
    return fetch("".concat(_this.origin, "/service/home/~/?auth=co&id=").concat(id).concat(part ? "&part=".concat(part) : ''), {
      headers: _objectSpread2({}, isSecure && {
        'X-Zimbra-Encoding': 'x-base64'
      }, {}, _this.csrfToken && {
        'X-Zimbra-Csrf-Token': _this.csrfToken
      }),
      credentials: 'include'
    }).then(function (response) {
      if (response.ok) {
        return response.text().then(function (content) {
          if (!content) {
            return undefined;
          }

          return {
            id: id,
            part: part,
            content: content
          };
        });
      }
    });
  };

  this.getAdditionalRequestOptions = function () {
    var addCsrfToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    return _objectSpread2({
      jwtToken: _this.jwtToken
    }, addCsrfToken && {
      csrfToken: _this.csrfToken
    }, {
      sessionId: _this.sessionId || _this.sessionHandler && _this.sessionHandler.readSessionId(),
      origin: _this.origin,
      userAgent: _this.userAgent
    });
  };

  this.normalizeMessage = function (message) {
    return normalizeMessage(message, {
      origin: _this.origin,
      jwtToken: _this.jwtToken
    });
  };

  this.sessionHandler = options.sessionHandler;
  this.userAgent = options.userAgent;
  this.jwtToken = options.jwtToken;
  this.csrfToken = options.csrfToken;
  this.origin = options.zimbraOrigin !== undefined ? options.zimbraOrigin : DEFAULT_HOSTNAME;
  this.soapPathname = options.soapPathname || DEFAULT_SOAP_PATHNAME;
  this.notificationsEmitter = new emitter();
  this.batchDataLoader = new DataLoader(this.batchDataHandler, {
    cache: false
  });
  this.dataLoader = new DataLoader(this.dataHandler, {
    batch: false,
    cache: false
  });
};

var doc = {"kind":"Document","definitions":[{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"SortBy"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"none"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"dateAsc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"dateDesc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"subjAsc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"subjDesc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"nameAsc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"nameDesc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"rcptAsc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"rcptDesc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"attachAsc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"attachDesc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"flagAsc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"flagDesc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"priorityAsc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"priorityDesc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"readAsc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"readDesc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"sizeAsc"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"sizeDesc"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"ShareInputAction"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"edit"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"revoke"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"expire"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"FreeBusyStatus"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"F"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"B"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"T"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"O"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"AccountType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"imap"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"pop3"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"ConnectionType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"cleartext"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"ssl"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"tls"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"tls_is_available"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"PrefCalendarInitialView"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"day"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"list"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"month"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"week"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"workWeek"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"year"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"PrefMailSendReadReceipts"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"prompt"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"always"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"never"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"PrefDelegatedSendSaveTarget"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"owner"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"sender"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"both"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"none"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"AlarmAction"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"DISPLAY"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"AUDIO"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"EMAIL"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"PROCEDURE"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"X_YAHOO_CALENDAR_ACTION_IM"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"X_YAHOO_CALENDAR_ACTION_MOBILE"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"NONE"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"AlarmRelatedTo"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"START"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"END"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"Weekday"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"SU"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"MO"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"TU"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"WE"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"TH"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"FR"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"SA"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceFrequency"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"SEC"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"MIN"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"HOU"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"DAI"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"WEE"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"MON"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"YEA"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"InviteReplyVerb"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"ACCEPT"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"DECLINE"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"TENTATIVE"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"InviteReplyType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"r"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"w"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"AutoCompleteMatchType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"gal"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"contact"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"rankingTable"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"ParticipationStatus"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"NE"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"AC"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"TE"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"DE"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"DG"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"CO"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"IN"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"WA"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"DF"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"InviteCompletionStatus"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"NEED"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"TENT"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"CONF"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"CANC"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"COMP"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"INPR"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"WAITING"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"DEFERRED"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"ParticipationRole"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"REQ"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"OPT"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"NON"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"CalendarItemClass"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"PRI"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"PUB"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"CON"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"AddressType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"f"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"t"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"c"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"b"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"r"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"s"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"n"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"rf"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"GranteeType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"usr"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"grp"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"egp"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"dom"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"all"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"pub"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"guest"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"key"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"cos"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"SearchType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"conversation"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"message"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"contact"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"appointment"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"task"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"wiki"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"document"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"ContactType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"C"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"G"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"I"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"FolderView"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"search"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"folder"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"tag"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"conversation"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"message"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"contact"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"document"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"appointment"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"virtual"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"remote"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"wiki"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"task"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"chat"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"note"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"comment"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"GalSearchType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"all"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"account"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"resource"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"group"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"NeedIsMemberType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"all"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"directOnly"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"none"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"ReadingPaneLocation"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"off"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"right"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"bottom"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"PrefMailSelectAfterDelete"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"next"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"previous"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"adaptive"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"ActionTypeName"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"ContactAction"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"ConvAction"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"DistributionList"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"FolderAction"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"ItemAction"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"MsgAction"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"TagAction"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"LicenseStatus"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"OK"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"NOT_INSTALLED"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"NOT_ACTIVATED"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"IN_FUTURE"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"EXPIRED"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"INVALID"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"LICENSE_GRACE_PERIOD"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"ACTIVATION_GRACE_PERIOD"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"SetRecoveryAccountOp"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"sendCode"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"validateCode"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"resendCode"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"reset"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"SetRecoveryAccountChannel"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"email"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"RecoverAccountOp"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"getRecoveryAccount"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"sendRecoveryCode"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"PasswordRecoveryAddressStatus"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"verified"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"pending"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"ZimletPresence"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"mandatory"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"enabled"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"disabled"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"ResetPasswordStatus"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"enabled"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"disabled"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"suspended"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"PrefClientType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"advanced"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"modern"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"zimbrax"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"standard"},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CsrfToken"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AuthResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"authToken"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthToken"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"twoFactorAuthRequired"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorAuthRequired"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"trustedDevicesEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"TrustedDevicesEnabled"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lifetime"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"session"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Session"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"skin"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Skin"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"csrfToken"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CsrfToken"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ScratchCodeType"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ScratchCodes"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"scratchCodes"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ScratchCode"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ScratchCode"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"scratchCode"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ScratchCodeType"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"EnableTwoFactorAuthResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"secret"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Secret"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"scratchCodes"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ScratchCode"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"authToken"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthToken"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"csrfToken"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CsrfToken"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ProfileImageChangeResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"itemId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Secret"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AuthToken"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"TwoFactorAuthRequired"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"TrustedDevicesEnabled"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Session"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Skin"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CalOrganizer"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"address"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"url"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sentBy"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Instance"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"start"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"dueDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tzoDue"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"utcRecurrenceId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isException"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alarm"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"allDay"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changeDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"class"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemClass"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"componentNum"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"duration"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"excerpt"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"flags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"freeBusy"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"freeBusyActual"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"inviteId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"location"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifiedSequence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"organizer"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalOrganizer"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherAttendees"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"participationStatus"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipationStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revision"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"status"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteCompletionStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isOrganizer"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"exceptId"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DtTimeInfo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Alarm"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"alarmInstStart"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"componentNum"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"inviteId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"location"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"nextAlarm"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"InviteReplyResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"inviteId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"calendarItemId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ModifyAppointmentResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"appointmentId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"calendarItemId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"inviteId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifiedSequence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revision"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ZimletPref"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"presence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ModifyZimletPrefsResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimlet"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ZimletPref"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"EmailAddress"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"address"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"type"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"displayName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ShareNotification"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"truncated"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"MessageAttributes"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"isEncrypted"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isSigned"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InterfaceTypeDefinition","name":{"kind":"Name","value":"MailItem"},"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"subject"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"emailAddresses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"excerpt"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"conversationId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"flags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagNames"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revision"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changeDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifiedSequence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"invitations"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sortField"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"share"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShareNotification"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"replyType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ClientInfoAttributes"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraWebClientLoginURL"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraWebClientLogoutURL"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ClientInfoType"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"attributes"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ClientInfoAttributes"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"MessageInfo"},"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"MailItem"}}],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"origId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"subject"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"emailAddresses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"excerpt"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"conversationId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"flags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagNames"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revision"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changeDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifiedSequence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"invitations"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sortField"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"mimeParts"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MimePart"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"to"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"from"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"cc"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"bcc"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sender"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"html"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"text"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"attachments"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MimePart"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"inlineAttachments"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MimePart"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"share"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShareNotification"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"replyType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"attributes"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"MessageAttributes"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"autoSendTime"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"local"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Conversation"},"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"MailItem"}}],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"subject"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"excerpt"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"emailAddresses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"conversationId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"flags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagNames"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revision"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changeDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifiedSequence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"invitations"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sortField"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"messages"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MessageInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"messagesMetaData"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MessageInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"numMessages"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"unread"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"share"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShareNotification"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"replyType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"MsgWithGroupInfo"},"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"MailItem"}}],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"i4uid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"cif"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"origid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"entityId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"forAcct"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"autoSendTime"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"subject"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"emailAddresses"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"excerpt"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"conversationId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"flags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagNames"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revision"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changeDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifiedSequence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"invitations"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sortField"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"share"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShareNotification"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"replyType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"InviteType"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"appt"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"task"},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"InviteInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"type"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteType"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"components"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteComponent"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"replies"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteReplies"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AddRecurrenceInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"add"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddRecurrenceInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"exclude"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExcludeRecurrenceInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"except"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExceptionRuleInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"cancel"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelRuleInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"rule"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SimpleRepeatingRule"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ExcludeRecurrenceInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"exclude"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExcludeRecurrenceInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"except"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExceptionRuleInfo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ExceptionRuleInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"rangeType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"recurId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tz"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ridZ"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"add"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddRecurrenceInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"exclude"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExcludeRecurrenceInfo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CancelRuleInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"rangeType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"recurId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tz"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ridZ"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"WkDay"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"day"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Weekday"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ordwk"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ByDayRule"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"wkday"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WkDay"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"IntervalRule"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"intervalCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceEndDate"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceEndCount"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"number"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ByMonthDayRule"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"dayList"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ByMonthRule"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"monthList"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"BySetPosRule"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"poslist"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SimpleRepeatingRule"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"frequency"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceFrequency"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"interval"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IntervalRule"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"byday"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ByDayRule"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"until"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceEndDate"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"count"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceEndCount"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"bymonthday"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ByMonthDayRule"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"bymonth"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ByMonthRule"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"bysetpos"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BySetPosRule"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"RecurrenceInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"add"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddRecurrenceInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"exclude"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExcludeRecurrenceInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"except"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExceptionRuleInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"cancel"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelRuleInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"rule"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SimpleRepeatingRule"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"InviteReplies"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"reply"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemReply"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"InviteComponent"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"alarms"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAlarm"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"recurrence"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RecurrenceInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"allDay"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"attendees"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAttendee"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"calendarItemId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ciFolder"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"class"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemClass"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"completedDateTime"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"componentNum"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"description"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StringContent"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"draft"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"neverSent"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"end"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DtTimeInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"excerpt"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"freeBusy"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"freeBusyActual"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"htmlDescription"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StringContent"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isException"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isOrganizer"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"location"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"noBlob"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"organizer"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalOrganizer"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"percentComplete"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"priority"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"utcRecurrenceId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"rsvp"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sequence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"start"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DtTimeInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"status"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteCompletionStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"uid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"x_uid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"aid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"method"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"exceptId"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DtTimeInfo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"DtTimeInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"timezone"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"utc"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Invitation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"type"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sequenceNumber"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"componentNum"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"recurrenceId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tz"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalTZInfo"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"components"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteComponent"}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"replies"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteReplies"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"mimeParts"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"MimePart"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CalTZInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"timezoneStdOffset"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"timezoneDaylightOffset"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stdname"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"dayname"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"standard"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"TzOnsetInfo"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"daylight"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"TzOnsetInfo"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"TzOnsetInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"week"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"wkday"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"mon"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"mday"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"hour"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"min"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sec"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AppointmentInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"invitations"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Invitation"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemHitInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"alarm"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"allDay"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changeDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"class"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemClass"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"componentNum"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"timezoneOffset"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"duration"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"excerpt"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"flags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderId"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"freeBusy"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"freeBusyActual"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alarmData"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Alarm"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"instances"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Instance"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"invitations"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Invitation"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"inviteId"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isOrganizer"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isRecurring"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"location"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifiedSequence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"organizer"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalOrganizer"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherAttendees"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"participationStatus"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipationStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"percentComplete"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"priority"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revision"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"utcRecurrenceId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sortField"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"status"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteCompletionStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagNames"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"uid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"x_uid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"aid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"draft"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"neverSent"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ReminderItemHitInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"alarm"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"allDay"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changeDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"class"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemClass"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"componentNum"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"timezoneOffset"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"duration"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"excerpt"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"flags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderId"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"freeBusy"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"freeBusyActual"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"alarmData"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Alarm"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"instances"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Instance"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"invitations"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Invitation"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"inviteId"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isOrganizer"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isRecurring"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"location"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifiedSequence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"organizer"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalOrganizer"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherAttendees"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"participationStatus"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipationStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"percentComplete"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"priority"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revision"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"utcRecurrenceId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sortField"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"status"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteCompletionStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagNames"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"uid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"x_uid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"aid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"draft"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"neverSent"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ExternalAccountTestResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"success"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"error"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ExternalAccount"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"accountType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"isEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"host"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"port"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"connectionType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ConnectionType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"FreeBusyInstance"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"start"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"end"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"FreeBusy"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tentative"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyInstance"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"busy"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyInstance"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"unavailable"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyInstance"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"nodata"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyInstance"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"free"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyInstance"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"WorkingHoursInstance"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"start"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"end"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"WorkingHours"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tentative"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkingHoursInstance"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"busy"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkingHoursInstance"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"unavailable"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkingHoursInstance"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"nodata"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkingHoursInstance"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"free"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkingHoursInstance"}}},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"Importance"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"high"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"normal"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"low"},"directives":[]}]},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"FilterMatchCondition"},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"allof"},"directives":[]},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"anyof"},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AddressCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"header"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"part"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stringComparison"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"caseSensitive"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"value"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"valueComparison"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"countComparison"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"BasicCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"BodyCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"caseSensitive"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"value"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ConversationCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"where"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"DateCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"dateComparison"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"FlagCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"flagName"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"HeaderCheckCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"header"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"HeaderCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"header"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stringComparison"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"valueComparison"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"countComparison"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"value"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"caseSensitive"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ImportanceCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"importance"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Importance"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"InviteCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"methods"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"MimeHeaderCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"header"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stringComparison"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"value"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"caseSensitive"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SizeCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"numberComparison"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"FilterCondition"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"allOrAny"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterMatchCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"addressBook"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderCheckCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"address"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddressCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"attachment"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"body"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BodyCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"bulk"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"contactRanking"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderCheckCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"conversation"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConversationCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"facebook"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"flag"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FlagCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"headerExists"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderCheckCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"header"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"importance"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImportanceCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"invite"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"linkedin"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"list"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"me"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderCheckCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"mimeHeader"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MimeHeaderCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SizeCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"twitter"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"communityRequests"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"communityContent"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicCondition"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"communityConnections"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicCondition"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"BasicAction"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"FileIntoAction"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderPath"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"copy"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"FlagAction"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"flagName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"TagAction"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagName"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"RedirectAction"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"address"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"copy"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ReplyAction"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"content"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"NotifyAction"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"address"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"subject"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"maxBodySize"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"origHeaders"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"index"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"content"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"FilterAction"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"keep"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicAction"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"discard"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicAction"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"fileInto"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileIntoAction"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"flag"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FlagAction"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tag"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TagAction"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"redirect"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RedirectAction"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"reply"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReplyAction"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"notify"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotifyAction"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"stop"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicAction"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Filter"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"active"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"actions"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterAction"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"conditions"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterCondition"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Folder"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"absFolderPath"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"acl"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ACL"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"color"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"flags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"uuid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"oname"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"nonFolderItemCount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"nonFolderItemCountTotal"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"linkedFolders"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folders"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"search"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"owner"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revision"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"view"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"FolderView"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"parentFolderId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"unread"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"query"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"permissions"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ownerZimbraId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sharedItemId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"url"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"local"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"droppable"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"broken"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deletable"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ACL"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"grant"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ACLGrant"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ACLGrant"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"address"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"permissions"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"granteeType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"GranteeType"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"password"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"key"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"LicenseAttrs"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"License"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"status"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LicenseStatus"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"attr"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LicenseAttrs"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"PropList"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"prop"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Prop"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Prop"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimlet"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AccountInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"publicURL"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"rest"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"used"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"profileImageId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changePasswordURL"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"soapURL"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"version"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"attrs"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountInfoAttrs"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"license"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"License"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"props"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PropList"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimlets"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountZimlet"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"cos"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountCos"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"OnlyEmailAddress"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"emailAddress"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Target"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"displayName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OnlyEmailAddress"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"type"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Targets"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"right"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"target"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Target"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"DiscoverRights"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"targets"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Targets"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AccountZimlet"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimlet"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountZimletInfo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AccountZimletInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimletContext"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountZimletContext"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimlet"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountZimletDesc"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimletConfig"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountZimletConfigInfo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AccountZimletContext"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"baseUrl"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"priority"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"presence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ZimletPresence"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AccountZimletDesc"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"version"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"description"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"extension"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"label"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraXZimletCompatibleSemVer"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AccountZimletConfigInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"version"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"description"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"extension"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"target"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"label"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AccountInfoAttrs"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"displayName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraIsAdminAccount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraIsDelegatedAdminAccount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureMailEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureCalendarEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureBriefcasesEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureRelatedContactsEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureChangePasswordEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureResetPasswordStatus"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetPasswordStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureWebClientOfflineAccessEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraMailBlacklistMaxNumEntries"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraMailQuota"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPublicSharingEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraExternalSharingEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureGalEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureGalAutoCompleteEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureOutOfOfficeReplyEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureFiltersEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureReadReceiptsEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureSharingEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureManageZimlets"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureTwoFactorAuthAvailable"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureTwoFactorAuthRequired"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureViewInHtmlEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraTwoFactorAuthEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureTrustedDevicesEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureAppSpecificPasswordsEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureMailPriorityEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFileUploadMaxSize"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraMailAlias"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureTaggingEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraIdentityMaxNumEntries"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraFeatureIdentitiesEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AccountCos"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Identities"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"identity"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Identity"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Identity"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"_attrs"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"IdentityAttrs"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"defaultSignature"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"DataSource"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"connectionType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"defaultSignature"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"emailAddress"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"l"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"forwardReplySignature"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"fromDisplay"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"host"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"importOnly"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"pollingInterval"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"port"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"replyToAddress"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"replyToDisplay"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"smtpPort"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"useAddressForForwardReply"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"username"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"failingSince"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lastError"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"StringContent"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Signatures"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"signature"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Signature"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Signature"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"content"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignatureContent"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SignatureContent"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"type"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"StringContent"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"DataSources"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"imap"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DataSource"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"pop3"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DataSource"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"cal"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DataSource"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"IdentityAttrs"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefIdentityId"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefDefaultSignatureId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefForwardReplySignatureId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefForwardReplyFormat"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefFromAddress"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefFromAddressType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefFromDisplay"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefIdentityName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMailSignatureStyle"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefReplyToAddress"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefReplyToDisplay"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefReplyToEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefSentMailFolder"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Preferences"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefAutoAddAppointmentsToCalendar"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarAutoAddInvites"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarFirstDayOfWeek"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarInitialView"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PrefCalendarInitialView"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarReminderEmail"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarWorkingHours"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarApptReminderWarningTime"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarShowPastDueReminders"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarToasterEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefComposeDirection"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefHtmlEditorDefaultFontColor"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefHtmlEditorDefaultFontFamily"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefHtmlEditorDefaultFontSize"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMailToasterEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefShowAllNewMailNotifications"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefDefaultCalendarId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefDeleteInviteOnReply"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefDelegatedSendSaveTarget"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PrefDelegatedSendSaveTarget"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefDisplayExternalImages"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefGroupMailBy"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMailPollingInterval"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMailRequestReadReceipts"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMailSelectAfterDelete"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PrefMailSelectAfterDelete"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMailSendReadReceipts"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PrefMailSendReadReceipts"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMailTrustedSenderList"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMarkMsgRead"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeFromDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeExternalReply"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeExternalReplyEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeReply"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeReplyEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeStatusAlertOnLogin"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeSuppressExternalReply"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeUntilDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefReadingPaneEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefReadingPaneLocation"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ReadingPaneLocation"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefPasswordRecoveryAddress"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefPasswordRecoveryAddressStatus"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordRecoveryAddressStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefSaveToSent"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefShowFragments"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefSlackCalendarReminderEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefSortOrder"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefWebClientOfflineBrowserKey"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefTimeZoneId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefLocale"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefClientType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"PrefClientType"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefAppleIcalDelegationEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarShowDeclinedMeetings"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefUseTimeZoneListInCalendar"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMailForwardingAddress"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMailLocalDeliveryDisabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefTagTreeOpen"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"GetAppointmentResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"appointment"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AppointmentInfo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"NameId"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SignatureResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"signature"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NameId"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Document"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"version"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"contentType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"descriptionEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changeDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifiedSequence"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revision"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sortField"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagNames"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"uuid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderUuid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"metadataVersion"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lastEditedAccount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revisonCreator"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revisedCreationDate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lockOwnerId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SearchResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"contacts"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Contact"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"messages"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MessageInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"conversations"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tasks"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemHitInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"appointments"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemHitInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"documents"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Document"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"more"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"offset"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sortBy"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"paginationSupported"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"hit"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Hit"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"RemindersResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"tasks"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReminderItemHitInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"appointments"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReminderItemHitInfo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Hit"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sortField"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SendMessageResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"message"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MsgWithGroupInfo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SaveDraftResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"message"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MessageInfo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CustomMetadataAttrs"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"key"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"value"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CustomMetadataMeta"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"section"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"_attrs"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomMetadataAttrs"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CustomMetadata"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"meta"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomMetadataMeta"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Contact"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"date"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revision"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sortField"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"fileAsStr"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"memberOf"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tags"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagNames"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"attributes"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactAttributes"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"members"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactListMember"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"OtherContactAttribute"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"key"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"value"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ContactAttributes"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"firstName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"middleName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lastName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"fullName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"maidenName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"namePrefix"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"nameSuffix"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"email2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workEmail"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workEmail2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homeEmail"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homeEmail2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"phone"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"phone2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"companyPhone"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"companyPhone2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherPhone"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherPhone2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"mobilePhone"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"mobilePhone2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homePhone"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homePhone2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workPhone"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workPhone2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"pager"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"pager2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homeFax"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homeFax2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workFax"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workFax2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"imAddress"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"imAddress1"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"imAddress2"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"imAddress3"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"imAddress4"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"imAddress5"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"nickname"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homeStreet"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homeCity"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homeState"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homePostalCode"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homeCountry"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"homeURL"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workStreet"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workCity"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workState"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workPostalCode"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workCountry"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"workURL"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"jobTitle"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"company"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"department"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"birthday"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"anniversary"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"website"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"notes"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"thumbnailPhoto"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"image"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactImage"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userCertificate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraCalResType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"assistantPhone"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"callbackPhone"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"carPhone"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherCity"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherCountry"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherFax"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherPostalCode"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherState"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherStreet"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"otherURL"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"fileAs"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"type"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"other"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OtherContactAttribute"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ContactImage"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"contentType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"filename"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"part"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ContactListMember"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"contacts"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Contact"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"type"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactType"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"value"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Tag"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"color"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"unread"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"OtherContactAttributeInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ClientInfoInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"domain"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ContactAttrsInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"firstName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"middleName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"lastName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fullName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"maidenName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"namePrefix"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"nameSuffix"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workEmail"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workEmail2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homeEmail"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homeEmail2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"phone"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"phone2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"companyPhone"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"companyPhone2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"otherPhone"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"otherPhone2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"mobilePhone"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"mobilePhone2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homePhone"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homePhone2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workPhone"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workPhone2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"pager"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"pager2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homeFax2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workFax2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"imAddress"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"imAddress1"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"imAddress2"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"imAddress3"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"imAddress4"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"imAddress5"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"nickname"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homeStreet"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homeCity"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homeFax"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homeState"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homePostalCode"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homeCountry"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"homeURL"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workFax"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workStreet"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workCity"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workState"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workPostalCode"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workCountry"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"workURL"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"jobTitle"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"company"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"department"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"birthday"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"anniversary"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"website"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"notes"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"image"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userCertificate"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"assistantPhone"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"callbackPhone"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"carPhone"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"otherCity"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"otherCountry"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"otherFax"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"otherPostalCode"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"otherState"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"otherStreet"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"otherURL"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fileAs"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"other"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OtherContactAttributeInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CreateContactInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"tagNames"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attributes"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactAttrsInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ContactListOps"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"op"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ModifyContactInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"tagNames"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attributes"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactAttrsInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"memberOps"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactListOps"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"RelatedContact"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"scope"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"p"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ContactFrequencyResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"data"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactFrequencyData"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ContactFrequencyData"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"by"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"dataPoint"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactFrequencyDataPoints"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ContactFrequencyDataPoints"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"label"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"value"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CustomMetadataAttrsInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CustomMetadataInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"section"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attrs"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomMetadataAttrsInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"EmailAddressInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"shortName"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ShareInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderId"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderPath"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderUuid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"granteeName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"granteeDisplayName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"granteeId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"granteeType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ownerEmail"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ownerId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ownerName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"rights"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"view"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"FolderView"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"mid"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"MailboxMetadataAttrs"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefCustomFolderTreeOpen"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefDateFormat"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefSharedFolderTreeOpen"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefFoldersExpanded"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefFolderTreeSash"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefGenerateLinkPreviews"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefGroupByList"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMessageListDensity"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefMultitasking"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefReadingPaneSashHorizontal"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefReadingPaneSashVertical"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefSmartFolderTreeOpen"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefTimeFormat"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefUndoSendEnabled"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefUndoSendTimeout"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"archivedFolder"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefSMIMEDefaultSetting"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefSMIMELastOperation"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraPrefContactSourceFolderID"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"MailboxMetadataMeta"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"section"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"_attrs"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxMetadataAttrs"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"MailboxMetadata"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"meta"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxMetadataMeta"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"MailboxMetadataSectionAttrsInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefCustomFolderTreeOpen"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefDateFormat"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefSharedFolderTreeOpen"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefFoldersExpanded"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefFolderTreeSash"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefGenerateLinkPreviews"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefGroupByList"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMessageListDensity"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMultitasking"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefReadingPaneSashHorizontal"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefReadingPaneSashVertical"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefSmartFolderTreeOpen"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefTimeFormat"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefUndoSendEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefUndoSendTimeout"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"archivedFolder"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefSMIMEDefaultSetting"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefSMIMELastOperation"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefContactSourceFolderID"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"MimePart"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"body"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"filename"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"part"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"contentId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"contentType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"contentDisposition"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"mimeParts"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MimePart"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"url"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"messageId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"MimePartInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"body"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"filename"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"part"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"content"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contentId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contentType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contentDisposition"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"size"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"mimeParts"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MimePartInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"url"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"messageId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attachments"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AttachmentInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ExistingAttachmentInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"messageId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"part"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"DocumentInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"AttachmentInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attachmentId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"documents"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"existingAttachments"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExistingAttachmentInput"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AutoCompleteResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"canBeCached"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"match"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AutoCompleteMatch"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AutoCompleteGALResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"contacts"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Contact"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AutoCompleteMatch"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"type"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AutoCompleteMatchType"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"ranking"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isGroup"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"exp"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"display"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"first"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"middle"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"last"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"full"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"nick"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"company"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"fileas"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"modifiedSequence"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"revision"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"componentNum"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"message"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemMessageInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemMessageInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"subject"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"invitations"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemInviteInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"mimeParts"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MimePartInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"emailAddresses"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailItemEmailAddressInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attachments"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AttachmentInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"replyType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteReplyType"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CounterAppointmentInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"modifiedSequence"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"revision"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"componentNum"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"message"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CounterAppointmentMessageInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CounterAppointmentMessageInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"origId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"subject"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"invitations"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarCounterAppointmentInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"mimeParts"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MimePartInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"emailAddresses"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailItemEmailAddressInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attachments"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AttachmentInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"replyType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteReplyType"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"SendMessageInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"origId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attach"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AttachmentInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attachmentId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"replyType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"inReplyTo"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"flags"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"autoSendTime"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"draftId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"entityId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"subject"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"mimeParts"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MimePartInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"emailAddresses"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailItemEmailAddressInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attachments"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AttachmentInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemInviteInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"components"},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemInviteComponentInput"}}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarCounterAppointmentInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"components"},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemInviteComponentCounterInput"}}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"MailItemEmailAddressInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddressType"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemInviteComponentInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"location"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"start"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemDateTimeInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"end"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemDateTimeInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"exceptId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarOptionalItemDateTimeInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"freeBusy"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyStatus"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"allDay"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"organizer"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemOrganizerInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"recurrence"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attendees"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAttendeesInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"alarms"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAlarmInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"class"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemClass"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"priority"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"percentComplete"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"status"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteCompletionStatus"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"noBlob"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"description"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemInviteComponentDescriptionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"draft"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemInviteComponentDescriptionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"_content"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemDateTimeInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"timezone"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"date"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarOptionalItemDateTimeInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"timezone"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"date"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemInviteComponentCounterInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"location"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"start"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemDateTimeInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"end"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemDateTimeInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"exceptId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarOptionalItemDateTimeInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"freeBusy"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusyStatus"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"allDay"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"organizer"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemOrganizerInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"recurrence"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attendees"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAttendeesInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"alarms"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAlarmInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"class"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemClass"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"uid"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"priority"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"percentComplete"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"status"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteCompletionStatus"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"noBlob"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"description"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemInviteComponentDescriptionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"draft"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemAttendee"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"role"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipationRole"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"participationStatus"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipationStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"rsvp"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"address"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"calendarUserType"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemReply"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"participationStatus"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipationStatus"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"attendee"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemAttendeesInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"role"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipationRole"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"participationStatus"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ParticipationStatus"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"rsvp"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"calendarUserType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemAlarmTriggerRelative"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"weeks"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"days"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"hours"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"minutes"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"seconds"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"relatedTo"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AlarmRelatedTo"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"negative"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemAlarmAttendees"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemAlarmTrigger"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"relative"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAlarmTriggerRelative"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemAlarm"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"action"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AlarmAction"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"trigger"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAlarmTrigger"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"attendees"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAlarmAttendees"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"RecoverAccount"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"recoveryAccount"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"recoveryAttemptsLeft"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"WhiteBlackAddress"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"op"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"WhiteBlackListArr"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"addr"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WhiteBlackAddress"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"WhiteBlackList"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"whiteList"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WhiteBlackListArr"}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"blackList"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WhiteBlackListArr"}}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemAlarmInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"action"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AlarmAction"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"trigger"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAlarmTriggerInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attendees"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAlarmAttendeesInput"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemAlarmAttendeesInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemAlarmTriggerInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"relative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAlarmTriggerRelativeInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"absolute"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemAlarmTriggerAbsoluteInput"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemAlarmTriggerRelativeInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"weeks"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"days"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"hours"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"minutes"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"seconds"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"relatedTo"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AlarmRelatedTo"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemAlarmTriggerAbsoluteInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"date"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemOrganizerInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"sentBy"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"add"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceAddInput"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceAddInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"rule"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceRuleInput"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceRuleInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"interval"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceIntervalInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"frequency"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceFrequency"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"count"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceEndCountInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"until"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceEndDateInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"byday"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceByDayInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"bymonthday"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceByMonthDayInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"bymonth"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceByMonthInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"bysetpos"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemRecurrenceBySetPosInput"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceIntervalInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"intervalCount"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefAutoAddAppointmentsToCalendar"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceEndCountInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"number"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceEndDateInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"date"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceByDayInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"wkday"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WkDayInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"WkDayInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"day"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Weekday"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ordwk"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceByMonthDayInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"dayList"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceByMonthInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"monthList"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CalendarItemRecurrenceBySetPosInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"poslist"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"NewMountpointSpec"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"owner"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"view"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"flags"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ownerZimbraId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"sharedItemId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"color"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"reminder"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"parentFolderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CreateMountpointInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"link"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NewMountpointSpec"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"FolderQueryInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"uuid"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"view"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FolderView"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"FolderActionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"op"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"grant"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GrantInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"color"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CreateTagInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"color"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"FolderActionChangeColorInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"color"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"FolderActionCheckCalendarInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ContactFrequencySpec"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"range"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"interval"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"GrantInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"granteeType"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GranteeType"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"permissions"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"Right"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"right"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"GetRightsInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"access"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Right"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"GrantRightsInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"access"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountACEInfoInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"RevokeRightsInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"access"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountACEInfoInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"AccountACEInfoInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"granteeType"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GranteeType"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"right"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"key"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"deny"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"checkGrantee"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"InviteReplyInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"componentNum"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"verb"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteReplyVerb"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"updateOrganizer"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"message"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemMessageInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"exceptId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InstanceDate"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"PropertiesInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimlet"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"_content"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"PreferencesInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefAutoAddAppointmentsToCalendar"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarAutoAddInvites"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefDefaultCalendarId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarFirstDayOfWeek"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarInitialView"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PrefCalendarInitialView"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarReminderEmail"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarWorkingHours"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarApptReminderWarningTime"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarShowPastDueReminders"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarToasterEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefComposeDirection"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefHtmlEditorDefaultFontColor"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefHtmlEditorDefaultFontFamily"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefHtmlEditorDefaultFontSize"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMailToasterEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefShowAllNewMailNotifications"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefDelegatedSendSaveTarget"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PrefDelegatedSendSaveTarget"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefDisplayExternalImages"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefGroupMailBy"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMailPollingInterval"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMailRequestReadReceipts"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMailSelectAfterDelete"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PrefMailSelectAfterDelete"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMailSendReadReceipts"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PrefMailSendReadReceipts"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMailTrustedSenderList"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMarkMsgRead"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeFromDate"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeExternalReply"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeExternalReplyEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeReply"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeReplyEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeStatusAlertOnLogin"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeSuppressExternalReply"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefOutOfOfficeUntilDate"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefReadingPaneEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefReadingPaneLocation"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ReadingPaneLocation"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefSaveToSent"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefShowFragments"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefSlackCalendarReminderEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefSortOrder"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefWebClientOfflineBrowserKey"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefTimeZoneId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefLocale"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefClientType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PrefClientType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefAppleIcalDelegationEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefCalendarShowDeclinedMeetings"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefUseTimeZoneListInCalendar"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMailForwardingAddress"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMailLocalDeliveryDisabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefTagTreeOpen"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ModifyIdentityInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attrs"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IdentityAttrsInput"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"DeleteIdentityInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CreateIdentityInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attrs"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IdentityAttrsInput"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ZimletPreferenceInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"presence"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"AddressConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"header"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"part"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"stringComparison"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"caseSensitive"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"valueComparison"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"countComparison"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"BasicConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"BodyConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"caseSensitive"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ConversationConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"where"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"DateConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"dateComparison"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"date"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"FlagConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"flagName"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"HeaderCheckConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"header"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"HeaderConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"header"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"stringComparison"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"valueComparison"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"countComparison"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"caseSensitive"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ImportanceConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"importance"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Importance"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"InviteConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"methods"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"MimeHeaderConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"header"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"stringComparison"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"caseSensitive"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"SizeConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"numberComparison"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"size"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"negative"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"FilterConditionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"allOrAny"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterMatchCondition"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"addressBook"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderCheckConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddressConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attachment"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"body"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BodyConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"bulk"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contactRanking"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderCheckConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"conversation"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConversationConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"date"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"facebook"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"flag"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FlagConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"headerExists"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderCheckConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"header"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"importance"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImportanceConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"invite"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"linkedin"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"list"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"me"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HeaderCheckConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"mimeHeader"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MimeHeaderConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"size"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SizeConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"twitter"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"communityRequests"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"communityContent"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicConditionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"communityConnections"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicConditionInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"BasicActionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"FileIntoActionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderPath"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"copy"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"FlagActionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"flagName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"TagActionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"tagName"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"RedirectActionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"copy"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ReplyActionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"content"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"NotifyActionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"subject"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"maxBodySize"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"origHeaders"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"index"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"content"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"FilterActionInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"keep"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicActionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"discard"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicActionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fileInto"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileIntoActionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"flag"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FlagActionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"tag"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TagActionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"redirect"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RedirectActionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"reply"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReplyActionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"notify"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotifyActionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"stop"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BasicActionInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"FilterInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"active"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"actions"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterActionInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"conditions"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterConditionInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"FilterRuleInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ForwardExceptIdInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"timezone"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"date"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ForwardAppointmentInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"message"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ForwardMessageInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"exceptId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ForwardExceptIdInput"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ForwardAppointmentInviteInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"message"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ForwardMessageInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ForwardMessageInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"subject"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"mimeParts"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MimePartInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"emailAddresses"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailItemEmailAddressInput"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ShareNotificationInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"action"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ShareInputAction"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"item"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShareNotificationItemInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShareNotificaitonEmailAddressInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"notes"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ShareNotificationItemInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ShareNotificaitonEmailAddressInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"address"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AddressType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"personalName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"IdentityAttrsInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefIdentityId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefDefaultSignatureId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefForwardReplySignatureId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefForwardReplyFormat"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefFromAddress"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefFromAddressType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefFromDisplay"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefIdentityName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefMailSignatureStyle"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefReplyToAddress"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefReplyToDisplay"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefReplyToEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimbraPrefSentMailFolder"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ExternalAccountAddInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"accountType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"connectionType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ConnectionType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"emailAddress"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"host"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"isEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"l"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"leaveOnServer"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"port"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ExternalAccountTestInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"accountType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"connectionType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ConnectionType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"emailAddress"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"host"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"leaveOnServer"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"port"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ExternalAccountModifyAttrsInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"accountType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"defaultSignature"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"description"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"emailAddress"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fromDisplay"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"replyToAddress"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"replyToDisplay"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"replyToEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"storeAndForward"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"useAddressForForwardReply"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"host"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"signatureValue"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"importOnly"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"forwardReplySignature"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"connectionType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ConnectionType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"isEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"port"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"smtpPort"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"EnableTwoFactorAuthInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"twoFactorCode"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"authToken"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"csrfTokenSecured"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ExternalAccountImportInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"accountType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"GetFolderFolderInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"uuid"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"parentFolderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"path"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"Cursor"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"sortField"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"endSortVal"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"includeOffset"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"MailItemHeaderInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"n"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"NameIdInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"InstanceDate"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"date"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"DeleteAppointmentInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"instanceDate"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InstanceDate"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"inviteId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"componentNum"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"start"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"message"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemMessageInput"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"SignatureInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"content"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SignatureContentInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contentId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"SearchFolderInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"query"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"types"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FolderView"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"SignatureContentInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"_content"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"WhiteBlackAddressOpts"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"_content"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"op"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"WhiteBlackListArrInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"addr"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WhiteBlackAddressOpts"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"WhiteBlackListInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"whiteList"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"WhiteBlackListArrInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"blackList"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"WhiteBlackListArrInput"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"SnoozeInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"until"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"DismissInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"dismissedAt"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"AddMsgInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"absFolderPath"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"content"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"meta"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"SaveMessageDataInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"content"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"meta"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"Grantee"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"Owner"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"by"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"_content"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"uploadDocument"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"messagePartForDocument"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"messageId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attachmentPart"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"SaveDocumentInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"version"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contentType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"upload"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uploadDocument"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"messageData"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"messagePartForDocument"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"descriptionEnabled"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SMimePublicCert"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"store"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"field"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SMimePublicCerts"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"cert"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SMimePublicCert"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SMimePublicCertsResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"certs"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SMimePublicCerts"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"SMimeMessage"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Attachment"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ActionOpResponseData"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"op"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"ActionOpResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"action"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ActionOpResponseData"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"RightsResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"access"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountACEInfo"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AccountACEInfo"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"zimbraId"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"granteeType"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GranteeType"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"right"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"address"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"key"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"password"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deny"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"checkGrantee"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Locale"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"localName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"GetTrustedDevicesResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"nOtherDevices"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"thisDeviceTrusted"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AppSpecificPassword"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"appName"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"created"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lastUsed"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AppSpecificPasswords"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"passwordData"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AppSpecificPassword"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"MaxAppPasswords"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"_content"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AppSpecificPasswordsResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"appSpecificPasswords"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AppSpecificPasswords"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"maxAppPasswords"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MaxAppPasswords"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CreateAppSpecificPasswordResponse"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"password"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"accountInfo"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountInfo"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"autoComplete"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GalSearchType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"needExp"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folders"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"includeGal"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AutoCompleteResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"autoCompleteGAL"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"limit"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GalSearchType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"needExp"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AutoCompleteGALResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"clientInfo"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"domain"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ClientInfoType"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"downloadMessage"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"isSecure"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"SMimeMessage"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"downloadAttachment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"part"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Attachment"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"discoverRights"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"DiscoverRights"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"freeBusy"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"names"},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"start"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"end"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FreeBusy"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getContact"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ids"},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"derefGroupMember"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"memberOf"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Contact"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getAppointments"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"calExpandInstStart"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"calExpandInstEnd"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"query"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"limit"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"offset"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"types"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchType"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getAppointment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAppointmentResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getReminders"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"calExpandInstStart"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"calExpandInstEnd"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"query"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"limit"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"offset"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"types"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchType"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"RemindersResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getTasks"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"query"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"limit"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"offset"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"types"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchType"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getAppSpecificPasswords"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AppSpecificPasswordsResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getAvailableLocales"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Locale"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getContactFrequency"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"by"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"offsetInMinutes"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"spec"},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactFrequencySpec"}}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ContactFrequencyResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getConversation"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"header"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailItemHeaderInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"html"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"max"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"needExp"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fetch"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getFilterRules"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Filter"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getFolder"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"visible"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"needGranteeName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"view"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FolderView"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"depth"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"traverseMountpoints"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folder"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GetFolderFolderInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getCustomMetadata"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"section"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomMetadata"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getMailboxMetadata"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"section"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxMetadata"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getMessage"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"header"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailItemHeaderInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"html"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"max"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"needExp"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"neuter"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"part"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"raw"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"read"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ridZ"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"MessageInfo"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getMessagesMetadata"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ids"},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MessageInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getRights"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"input"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetRightsInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"RightsResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getSMimePublicCerts"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contactAddr"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"store"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"SMimePublicCertsResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getScratchCodes"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ScratchCodes"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getSearchFolder"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getTrustedDevices"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"GetTrustedDevicesResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getWhiteBlackList"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"WhiteBlackList"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getWorkingHours"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"names"},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"start"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"end"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkingHours"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"noop"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getPreferences"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Preferences"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getDataSources"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DataSources"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getIdentities"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Identities"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getSignatures"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Signatures"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"recoverAccount"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"op"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RecoverAccountOp"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"channel"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetRecoveryAccountChannel"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"RecoverAccount"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"relatedContacts"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RelatedContact"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"shareInfo"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"internal"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"includeSelf"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"grantee"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Grantee"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"owner"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Owner"}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShareInfo"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contact"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"cursor"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Cursor"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fetch"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fullConversation"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"limit"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"needExp"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"memberOf"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"offset"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"query"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"recip"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"sortBy"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortBy"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"types"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"resultMode"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"searchGal"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"needIsOwner"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"needIsMember"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NeedIsMemberType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GalSearchType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"offset"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"limit"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"locale"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"sortBy"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"needExp"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"taskFolders"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getTag"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"action"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ActionTypeName"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ids"},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"op"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"color"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"constraints"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"flags"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"rgb"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"tagNames"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"applyFilterRules"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ids"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"filterRules"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterRuleInput"}}},"directives":[]}],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"testExternalAccount"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"externalAccount"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExternalAccountTestInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExternalAccountTestResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"addExternalAccount"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"externalAccount"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExternalAccountAddInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"addMessage"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"message"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddMsgInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"MessageInfo"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"cancelTask"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"inviteId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"saveDocument"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"document"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveDocumentInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changeFolderColor"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"color"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"loginNewPassword"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyProfileImage"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"content"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contentType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProfileImageChangeResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"checkCalendar"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"contactAction"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ids"},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"op"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"tagNames"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ActionOpResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"conversationAction"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ids"},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"op"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"counterAppointment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"counterAppointmentInvite"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CounterAppointmentInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createAppointment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"accountName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appointment"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createAppointmentException"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"accountName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appointment"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createAppSpecificPassword"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appName"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAppSpecificPasswordResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createCalendar"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"color"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"url"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createContact"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contact"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateContactInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Contact"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createContactList"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contact"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateContactInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Contact"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyContact"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contact"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ModifyContactInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Contact"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyContactList"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"contact"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ModifyContactInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Contact"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createFolder"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"color"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"fetchIfExists"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"flags"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"parentFolderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"url"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"view"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FolderView"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createIdentity"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attrs"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IdentityAttrsInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Identities"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createMountpoint"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"link"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewMountpointSpec"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createSharedCalendar"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"link"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewMountpointSpec"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createSearchFolder"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"parentFolderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"query"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"types"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FolderView"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Folder"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createSignature"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"signature"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignatureInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"SignatureResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createTask"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"task"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"declineCounterAppointment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"counterAppointmentInvite"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CounterAppointmentInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteAppointment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appointment"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteAppointmentInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteIdentity"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteExternalAccount"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteSignature"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"signature"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NameIdInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"generateScratchCodes"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ScratchCodes"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"grantRights"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"input"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GrantRightsInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"RightsResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"folderAction"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"action"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FolderActionInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"forwardAppointmentInvite"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appointmentInvite"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ForwardAppointmentInviteInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"forwardAppointment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appointmentInvite"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ForwardAppointmentInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"itemAction"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ids"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"folderId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"op"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"importExternalAccount"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"externalAccount"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExternalAccountImportInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"logout"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"recoveryCode"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"tokenType"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"persistAuthTokenCookie"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"twoFactorCode"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"deviceTrusted"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"csrfTokenSecured"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"enableTwoFactorAuth"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"options"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnableTwoFactorAuthInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"EnableTwoFactorAuthResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"disableTwoFactorAuth"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"messageAction"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ids"},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"op"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyExternalAccount"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"type"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccountType"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attrs"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExternalAccountModifyAttrsInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyAppointment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"accountName"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appointment"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ModifyAppointmentResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyIdentity"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attrs"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IdentityAttrsInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyPrefs"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"prefs"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PreferencesInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyProps"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"props"},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PropertiesInput"}}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyZimletPrefs"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"zimlets"},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ZimletPreferenceInput"}}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"ModifyZimletPrefsResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyFilterRules"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"filters"},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterInput"}}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifySignature"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"signature"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignatureInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifySearchFolder"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"search"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchFolderInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyTask"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"task"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarItemInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"modifyWhiteBlackList"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"whiteBlackList"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WhiteBlackListInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"moveTask"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"inviteId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"destFolderId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"prefEnableOutOfOfficeAlertOnLogin"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"prefEnableOutOfOfficeReply"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"prefOutOfOfficeFromDate"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"prefOutOfOfficeReply"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"prefOutOfOfficeUntilDate"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"recoverAccount"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"op"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RecoverAccountOp"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"channel"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetRecoveryAccountChannel"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"RecoverAccount"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revokeAppSpecificPassword"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appName"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revokeOtherTrustedDevices"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revokeRights"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"input"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RevokeRightsInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"RightsResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"revokeTrustedDevice"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"saveDraft"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"message"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMessageInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveDraftResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sendMessage"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"message"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMessageInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMessageResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sendDeliveryReport"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"messageId"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sendInviteReply"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"inviteReply"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteReplyInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteReplyResponse"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"sendShareNotification"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"shareNotification"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShareNotificationInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"setCustomMetadata"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"customMetaData"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomMetadataInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"setMailboxMetadata"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"section"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"attrs"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxMetadataSectionAttrsInput"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"snoozeCalendarItem"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appointment"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SnoozeInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"task"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SnoozeInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"dismissCalendarItem"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appointment"},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DismissInput"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"task"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DismissInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"uploadMessage"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"value"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"setRecoveryAccount"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"channel"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetRecoveryAccountChannel"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"op"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetRecoveryAccountOp"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"recoveryAccount"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"recoveryAccountVerificationCode"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createTag"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"tag"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTagInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"tagAction"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"action"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FolderActionInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]},{"kind":"SchemaDefinition","directives":[],"operationTypes":[{"kind":"OperationTypeDefinition","operation":"query","type":{"kind":"NamedType","name":{"kind":"Name","value":"Query"}}},{"kind":"OperationTypeDefinition","operation":"mutation","type":{"kind":"NamedType","name":{"kind":"Name","value":"Mutation"}}}]}],"loc":{"start":0,"end":63144}};
    doc.loc.source = {"body":"enum SortBy {\n\tnone\n\tdateAsc\n\tdateDesc\n\tsubjAsc\n\tsubjDesc\n\tnameAsc\n\tnameDesc\n\trcptAsc\n\trcptDesc\n\tattachAsc\n\tattachDesc\n\tflagAsc\n\tflagDesc\n\tpriorityAsc\n\tpriorityDesc\n\treadAsc\n\treadDesc\n\tsizeAsc\n\tsizeDesc\n}\n\nenum ShareInputAction {\n\tedit\n\trevoke\n\texpire\n}\n\nenum FreeBusyStatus {\n\tF # Free\n\tB # Busy\n\tT # Tentative\n\tO # Out of Office\n}\n\nenum AccountType {\n\timap\n\tpop3\n}\n\nenum ConnectionType {\n\tcleartext\n\tssl\n\ttls\n\ttls_is_available\n}\n\nenum PrefCalendarInitialView {\n\tday\n\tlist\n\tmonth\n\tweek\n\tworkWeek\n\tyear\n}\nenum PrefMailSendReadReceipts {\n\tprompt\n\talways\n\tnever\n}\nenum PrefDelegatedSendSaveTarget {\n\towner\n\tsender\n\tboth\n\tnone\n}\n\nenum AlarmAction {\n\tDISPLAY\n\tAUDIO\n\tEMAIL\n\tPROCEDURE\n\tX_YAHOO_CALENDAR_ACTION_IM\n\tX_YAHOO_CALENDAR_ACTION_MOBILE\n\tNONE\n}\n\nenum AlarmRelatedTo {\n\tSTART\n\tEND\n}\n\nenum Weekday {\n\tSU\n\tMO\n\tTU\n\tWE\n\tTH\n\tFR\n\tSA\n}\n\nenum CalendarItemRecurrenceFrequency {\n\tSEC\n\tMIN\n\tHOU\n\tDAI\n\tWEE\n\tMON\n\tYEA\n}\n\nenum InviteReplyVerb {\n\tACCEPT\n\tDECLINE\n\tTENTATIVE\n}\n\nenum InviteReplyType {\n\tr #reply\n\tw #forward\n}\n\nenum AutoCompleteMatchType {\n\tgal\n\tcontact\n\trankingTable\n}\n\nenum ParticipationStatus {\n\tNE # needs-action\n\tAC # accept\n\tTE # tentative\n\tDE # declined\n\tDG # delegated\n\tCO # completed\n\tIN # in-process\n\tWA # waiting (only tasks)\n\tDF # deferred (only tasks)\n}\n\nenum InviteCompletionStatus {\n\tNEED # Not Started / Need Response\n\tTENT # Tentative\n\tCONF # Confirmed\n\tCANC # Cancelled\n\tCOMP # Completed\n\tINPR # In Progress\n\tWAITING # Waiting on someone else\n\tDEFERRED # Deferred\n}\n\nenum ParticipationRole {\n\tREQ # required\n\tOPT # optional\n\tNON # informational purposes only\n}\n\nenum CalendarItemClass {\n\tPRI # Private\n\tPUB # Public\n\tCON # Confidential\n}\n\nenum AddressType {\n\tf # from\n\tt # to\n\tc # cc\n\tb # bcc\n\tr # reply-to\n\ts # sender\n\tn # read-receipt notification\n\trf # resent-from\n}\n\n# https://github.com/Zimbra/zm-mailbox/blob/develop/store/docs/acl.md\nenum GranteeType {\n\tusr # Zimbra User\n\tgrp # Zimbra Group (distribution list)\n\tegp # an external AD group\n\tdom # Zimbra Domain\n\tall # All authenticated users\n\tpub # public access\n\tguest # Non-zimbra email address and password\n\tkey # Non-Zimbra email address and access key\n\tcos # Grantee ID must match zimbraCOSId (Class of Service)\n}\n\nenum SearchType {\n\tconversation\n\tmessage\n\tcontact\n\tappointment\n\ttask\n\twiki\n\tdocument\n}\n\nenum ContactType {\n\tC # Reference to another contact\n\tG # Reference to a GAL entry\n\tI # Inlined member (member name and email address is embeded in the contact group)\n}\n\nenum FolderView {\n\tsearch\n\tfolder\n\ttag\n\tconversation\n\tmessage\n\tcontact\n\tdocument\n\tappointment\n\tvirtual\n\tremote\n\twiki\n\ttask\n\tchat\n\tnote\n\tcomment\n}\n\nenum GalSearchType {\n\tall\n\taccount\n\tresource\n\tgroup\n}\n\nenum NeedIsMemberType {\n\tall\n\tdirectOnly\n\tnone\n}\n\nenum ReadingPaneLocation {\n\toff\n\tright\n\tbottom\n}\n\nenum PrefMailSelectAfterDelete {\n\tnext\n\tprevious\n\tadaptive\n}\n\nenum ActionTypeName {\n\tContactAction\n\tConvAction\n\tDistributionList\n\tFolderAction\n\tItemAction\n\tMsgAction\n\tTagAction\n}\n\nenum LicenseStatus {\n\tOK\n\tNOT_INSTALLED\n\tNOT_ACTIVATED\n\tIN_FUTURE\n\tEXPIRED\n\tINVALID\n\tLICENSE_GRACE_PERIOD\n\tACTIVATION_GRACE_PERIOD\n}\n\nenum SetRecoveryAccountOp {\n\tsendCode\n\tvalidateCode\n\tresendCode\n\treset\n}\n\nenum SetRecoveryAccountChannel {\n\temail\n}\n\nenum RecoverAccountOp {\n\tgetRecoveryAccount\n\tsendRecoveryCode\n}\n\nenum PasswordRecoveryAddressStatus {\n\tverified\n\tpending\n}\n\nenum ZimletPresence {\n\tmandatory\n\tenabled\n\tdisabled\n}\n\nenum ResetPasswordStatus {\n\tenabled\n\tdisabled\n\tsuspended\n}\n\nenum PrefClientType {\n\tadvanced\n\tmodern\n\tzimbrax\n\tstandard\n}\n\ntype CsrfToken {\n\t_content: String\n}\n\ntype AuthResponse {\n\tauthToken: [AuthToken]\n\ttwoFactorAuthRequired: TwoFactorAuthRequired\n\ttrustedDevicesEnabled: TrustedDevicesEnabled\n\tlifetime: Float\n\tsession: Session\n\tskin: [Skin]\n\tcsrfToken: CsrfToken\n}\n\ntype ScratchCodeType {\n\t_content: String\n}\n\ntype ScratchCodes {\n\tscratchCodes: ScratchCode\n}\n\ntype ScratchCode {\n\tscratchCode: [ScratchCodeType]\n}\n\ntype EnableTwoFactorAuthResponse {\n\tsecret: [Secret]\n\tscratchCodes: [ScratchCode]\n\tauthToken: [AuthToken]\n\tcsrfToken: [CsrfToken]\n}\n\ntype ProfileImageChangeResponse {\n\titemId: ID\n}\n\ntype Secret {\n\t_content: String\n}\n\ntype AuthToken {\n\t_content: String\n}\n\ntype TwoFactorAuthRequired {\n\t_content: Boolean\n}\n\ntype TrustedDevicesEnabled {\n\t_content: Boolean\n}\n\ntype Session {\n\tid: ID\n\t_content: String\n}\n\ntype Skin {\n\t_content: String\n}\n\ntype CalOrganizer {\n\taddress: String\n\tname: String\n\turl: String\n\tsentBy: String\n}\n\ntype Instance {\n\tstart: Float\n\tdueDate: Float\n\ttzoDue: Int\n\tutcRecurrenceId: String\n\tisException: Boolean # ex\n\talarm: Boolean\n\tallDay: Boolean\n\tchangeDate: Float # md\n\tclass: CalendarItemClass\n\tcomponentNum: Int # compNum\n\tdate: Float # d\n\tduration: Float # dur\n\texcerpt: String # fr\n\tflags: String # f\n\tfreeBusy: FreeBusyStatus # fb\n\tfreeBusyActual: FreeBusyStatus # fba\n\tinviteId: ID #invId\n\tlocation: String # loc\n\tmodifiedSequence: Int # ms\n\tname: String\n\torganizer: CalOrganizer # or\n\totherAttendees: Boolean\n\tparticipationStatus: ParticipationStatus\n\trevision: Float # rev\n\tstatus: InviteCompletionStatus\n\tisOrganizer: Boolean # isOrg\n\texceptId: [DtTimeInfo]\n}\n\ntype Alarm {\n\talarmInstStart: Float\n\tcomponentNum: Int # compNum\n\tinviteId: ID #invId\n\tlocation: String # loc\n\tname: String\n\tnextAlarm: Float\n}\n\ntype InviteReplyResponse {\n\tinviteId: ID #invId\n\tcalendarItemId: ID #calItemId\n}\n\ntype ModifyAppointmentResponse {\n\tappointmentId: ID #appointmentId\n\tcalendarItemId: ID #calItemId\n\tinviteId: ID #invId\n\tmodifiedSequence: Int # ms\n\trevision: Float # rev\n}\n\ntype ZimletPref {\n\tname: String\n\tpresence: String\n}\n\ntype ModifyZimletPrefsResponse {\n\tzimlet: [ZimletPref]\n}\n\ntype EmailAddress {\n\taddress: String\n\tname: String\n\ttype: String\n\tdisplayName: String\n}\n\ntype ShareNotification {\n\ttruncated: Boolean\n\tcontent: String\n}\n\ntype MessageAttributes {\n\tisEncrypted: Boolean\n\tisSigned: Boolean\n}\n\ninterface MailItem {\n\tid: ID\n\tsize: Float # s\n\tdate: Float # d\n\tfolderId: ID # l\n\tsubject: String # su\n\temailAddresses: [EmailAddress]\n\texcerpt: String # fr\n\tconversationId: ID # cid\n\tflags: String # f\n\ttags: String # t\n\ttagNames: String # tn\n\trevision: Float # rev\n\tchangeDate: Float # md\n\tmodifiedSequence: Int # ms\n\tinvitations: [InviteInfo] # inv\n\tsortField: String # sf, Sort field used for cursor-based pagination\n\tshare: [ShareNotification] # shr\n\treplyType: String #rt\n}\n\ntype ClientInfoAttributes {\n\tzimbraWebClientLoginURL: String\n\tzimbraWebClientLogoutURL: String\n}\n\ntype ClientInfoType {\n\tattributes: ClientInfoAttributes\n}\n\ntype MessageInfo implements MailItem {\n\tid: ID\n\tsize: Float # s\n\tdate: Float # d\n\tfolderId: ID # l\n\torigId: ID #origid\n\tsubject: String # su\n\temailAddresses: [EmailAddress]\n\texcerpt: String # fr\n\tconversationId: ID # cid\n\tflags: String # f\n\ttags: String # t\n\ttagNames: String # tn\n\trevision: Float # rev\n\tchangeDate: Float # md\n\tmodifiedSequence: Int # ms\n\tinvitations: [InviteInfo] # inv\n\tsortField: String # sf, Sort field used for cursor-based pagination\n\tmimeParts: [MimePart]\n\tto: [EmailAddress]\n\tfrom: [EmailAddress]\n\tcc: [EmailAddress]\n\tbcc: [EmailAddress]\n\tsender: [EmailAddress]\n\thtml: String\n\ttext: String\n\tattachments: [MimePart]\n\tinlineAttachments: [MimePart]\n\tshare: [ShareNotification] # shr\n\treplyType: String #rt\n\tattributes: MessageAttributes\n\tautoSendTime: Float\n\tlocal: Boolean\n}\n\ntype Conversation implements MailItem {\n\tid: ID\n\tsize: Float # s\n\tdate: Float # d\n\tfolderId: ID # l\n\tsubject: String # su\n\texcerpt: String # fr\n\temailAddresses: [EmailAddress]\n\tconversationId: ID # cid\n\tflags: String # f\n\ttags: String # t\n\ttagNames: String # tn\n\trevision: Float # rev\n\tchangeDate: Float # md\n\tmodifiedSequence: Int # ms\n\tinvitations: [InviteInfo] # inv\n\tsortField: String # sf, Sort field used for cursor-based pagination\n\tmessages: [MessageInfo]\n\tmessagesMetaData: [MessageInfo]\n\tnumMessages: Int # n, Number of messages in this conversation\n\tunread: Int # u\n\tshare: [ShareNotification] # shr\n\treplyType: String #rt\n}\n\ntype MsgWithGroupInfo implements MailItem {\n\tid: ID\n\ti4uid: Int\n\tcif: String\n\torigid: String\n\tentityId: ID # idnt\n\tforAcct: String\n\tautoSendTime: Float\n\tsize: Float # s\n\tdate: Float # d\n\tfolderId: ID # l\n\tsubject: String # su\n\temailAddresses: [EmailAddress]\n\texcerpt: String # fr\n\tconversationId: ID # cid\n\tflags: String # f\n\ttags: String # t\n\ttagNames: String # tn\n\trevision: Float # rev\n\tchangeDate: Float # md\n\tmodifiedSequence: Int # ms\n\tinvitations: [InviteInfo] # inv\n\tsortField: String # sf, Sort field used for cursor-based pagination\n\tshare: [ShareNotification] # shr\n\treplyType: String #rt\n}\n\nenum InviteType {\n\tappt # Appointment\n\ttask\n}\n\ntype InviteInfo {\n\ttype: InviteType #though type is a required value on the response, outdated invites come back as empty InviteInfo objects\n\tcomponents: [InviteComponent] #comp\n\treplies: [InviteReplies] #replies\n}\n\ntype AddRecurrenceInfo { # <add>\n\tadd: [AddRecurrenceInfo]\n\texclude: [ExcludeRecurrenceInfo]\n\texcept: [ExceptionRuleInfo]\n\tcancel: [CancelRuleInfo]\n\t# dates: SingleDates # TODO\n\trule: [SimpleRepeatingRule]\n}\n\ntype ExcludeRecurrenceInfo { # <exclude>\n\texclude: [ExcludeRecurrenceInfo]\n\texcept: [ExceptionRuleInfo]\n}\n\ntype ExceptionRuleInfo { # <except>\n\trangeType: Int\n\trecurId: String\n\ttz: String\n\tridZ: String\n\tadd: [AddRecurrenceInfo]\n\texclude: [ExcludeRecurrenceInfo]\n}\n\ntype CancelRuleInfo { # <cancel>\n\trangeType: Int\n\trecurId: String\n\ttz: String\n\tridZ: String\n}\n\n# type SingleDates { # <dates>\n# }\n\ntype WkDay { # <wkday>\n\tday: Weekday\n\tordwk: Int\n}\n\ntype ByDayRule { # <byday>\n\twkday: [WkDay]\n}\n\ntype IntervalRule { # <interval>\n\tintervalCount: Int # ival\n}\n\ntype CalendarItemRecurrenceEndDate {\n\tdate: String\n}\n\ntype CalendarItemRecurrenceEndCount {\n\tnumber: Int\n}\n\ntype ByMonthDayRule {\n\tdayList: String\n}\n\ntype ByMonthRule {\n\tmonthList: Int\n}\n\ntype BySetPosRule {\n\tposlist: Int\n}\n\ntype SimpleRepeatingRule { # <rule>\n\tfrequency: CalendarItemRecurrenceFrequency # freq\n\tinterval: [IntervalRule]\n\tbyday: [ByDayRule]\n\tuntil: [CalendarItemRecurrenceEndDate]\n\tcount: [CalendarItemRecurrenceEndCount]\n\tbymonthday: [ByMonthDayRule]\n\tbymonth: [ByMonthRule]\n\tbysetpos: [BySetPosRule]\n}\n\ntype RecurrenceInfo { # <recur>\n\tadd: [AddRecurrenceInfo]\n\texclude: [ExcludeRecurrenceInfo]\n\texcept: [ExceptionRuleInfo]\n\tcancel: [CancelRuleInfo]\n\t# dates: [SingleDates] # TODO\n\trule: [SimpleRepeatingRule]\n}\n\ntype InviteReplies {\n\treply: [CalendarItemReply]\n}\n\ntype InviteComponent {\n\t# duration: DurationInfo # dur - TODO\n\talarms: [CalendarItemAlarm]\n\trecurrence: [RecurrenceInfo] # recur\n\tallDay: Boolean\n\tattendees: [CalendarItemAttendee]\n\tcalendarItemId: ID\n\tciFolder: ID\n\tclass: CalendarItemClass\n\tcompletedDateTime: String # completed , yyyyMMddThhmmssZ\n\tcomponentNum: Int # compNum\n\tdate: Float # d\n\tdescription: [StringContent] # desc\n\tdraft: Boolean\n\tneverSent: Boolean\n\tend: [DtTimeInfo] # e\n\texcerpt: String # fr\n\tfreeBusy: FreeBusyStatus # fb\n\tfreeBusyActual: FreeBusyStatus # fba\n\thtmlDescription: [StringContent] # descHtml\n\tisException: Boolean # ex\n\tisOrganizer: Boolean # isOrg\n\tlocation: String # loc\n\tname: String\n\tnoBlob: Boolean\n\torganizer: CalOrganizer # or\n\tpercentComplete: String\n\tpriority: String\n\tutcRecurrenceId: String #ridZ\n\trsvp: Boolean\n\tsequence: Int # seq\n\tstart: [DtTimeInfo] # s\n\tstatus: InviteCompletionStatus\n\tuid: String\n\tx_uid: String\n\taid: String\n\tmethod: String\n\texceptId: [DtTimeInfo]\n}\n\ntype DtTimeInfo {\n\tdate: String # d , of format YYYYMMDD['T'HHMMSS[Z]]\n\ttimezone: String # tz\n\tutc: Float # u\n}\n\ntype Invitation { # <inv>\n\ttype: String!\n\tsequenceNumber: Int! # seq\n\tid: Int!\n\tcomponentNum: Int! # compNum\n\trecurrenceId: String # recurId\n\ttz: CalTZInfo\n\tcomponents: [InviteComponent]! # comp\n\treplies: [InviteReplies] # replies\n\tmimeParts: MimePart\n}\n\ntype CalTZInfo { # <tz>\n\tid: String\n\ttimezoneStdOffset: Int # stdoff\n\ttimezoneDaylightOffset: Int # dayoff\n\tstdname: String\n\tdayname: String\n\tstandard: TzOnsetInfo\n\tdaylight: TzOnsetInfo\n}\n\ntype TzOnsetInfo { # <standard>, <daylight>\n\tweek: Int\n\twkday: Int\n\tmon: Int\n\tmday: Int\n\thour: Int\n\tmin: Int\n\tsec: Int\n}\n\ntype AppointmentInfo { # <appt>; aka AppointmentHitInfo\n\tid: ID!\n\tinvitations: [Invitation] # inv\n}\n\ntype CalendarItemHitInfo { # <appt>; aka AppointmentHitInfo\n\talarm: Boolean\n\tallDay: Boolean\n\tchangeDate: Float # md\n\tclass: CalendarItemClass!\n\tcomponentNum: Int # compNum\n\tdate: Float # d\n\ttimezoneOffset: Int\n\tduration: Float # dur\n\texcerpt: String # fr\n\tflags: String # f\n\tfolderId: ID! # l\n\tfreeBusy: FreeBusyStatus # fb\n\tfreeBusyActual: FreeBusyStatus # fba\n\tid: ID!\n\talarmData: [Alarm]\n\tinstances: [Instance] # inst\n\tinvitations: [Invitation] # inv\n\tinviteId: ID! #invId\n\tisOrganizer: Boolean # isOrg\n\tisRecurring: Boolean # recur\n\tlocation: String # loc\n\tmodifiedSequence: Int # ms\n\tname: String\n\torganizer: CalOrganizer # or\n\totherAttendees: Boolean\n\tparticipationStatus: ParticipationStatus\n\tpercentComplete: String\n\tpriority: String\n\trevision: Float # rev\n\tutcRecurrenceId: String # ridZ\n\tsize: Float # s\n\tsortField: String # sf\n\tstatus: InviteCompletionStatus\n\ttagNames: String # tn\n\ttags: String # t\n\tuid: String\n\tx_uid: String\n\taid: String\n\tdraft: Boolean\n\tneverSent: Boolean\n}\n\ntype ReminderItemHitInfo { # <appt>; aka AppointmentHitInfo\n\talarm: Boolean\n\tallDay: Boolean\n\tchangeDate: Float # md\n\tclass: CalendarItemClass!\n\tcomponentNum: Int # compNum\n\tdate: Float # d\n\ttimezoneOffset: Int\n\tduration: Float # dur\n\texcerpt: String # fr\n\tflags: String # f\n\tfolderId: ID! # l\n\tfreeBusy: FreeBusyStatus # fb\n\tfreeBusyActual: FreeBusyStatus # fba\n\tid: ID!\n\talarmData: [Alarm]\n\tinstances: [Instance] # inst\n\tinvitations: [Invitation] # inv\n\tinviteId: ID! #invId\n\tisOrganizer: Boolean # isOrg\n\tisRecurring: Boolean # recur\n\tlocation: String # loc\n\tmodifiedSequence: Int # ms\n\tname: String\n\torganizer: CalOrganizer # or\n\totherAttendees: Boolean\n\tparticipationStatus: ParticipationStatus\n\tpercentComplete: String\n\tpriority: String\n\trevision: Float # rev\n\tutcRecurrenceId: String # ridZ\n\tsize: Float # s\n\tsortField: String # sf\n\tstatus: InviteCompletionStatus\n\ttagNames: String # tn\n\ttags: String # t\n\tuid: String\n\tx_uid: String\n\taid: String\n\tdraft: Boolean\n\tneverSent: Boolean\n}\n\ntype ExternalAccountTestResponse {\n\tsuccess: Boolean!\n\terror: String\n}\n\ninput ExternalAccount {\n\tid: ID!\n\tname: String!\n\taccountType: AccountType\n\tisEnabled: Int\n\thost: String!\n\tport: String!\n\tconnectionType: ConnectionType\n\tusername: String!\n\tpassword: String!\n}\n\ntype FreeBusyInstance {\n\tstart: Float\n\tend: Float\n}\n\ntype FreeBusy {\n\tid: String!\n\ttentative: [FreeBusyInstance]\n\tbusy: [FreeBusyInstance]\n\tunavailable: [FreeBusyInstance]\n\tnodata: [FreeBusyInstance]\n\tfree: [FreeBusyInstance]\n}\n\ntype WorkingHoursInstance {\n\tstart: Float\n\tend: Float\n}\n\ntype WorkingHours {\n\tid: ID!\n\ttentative: [WorkingHoursInstance]\n\tbusy: [WorkingHoursInstance]\n\tunavailable: [WorkingHoursInstance]\n\tnodata: [WorkingHoursInstance]\n\tfree: [WorkingHoursInstance]\n}\n##### Filters ######\n\nenum Importance {\n\thigh\n\tnormal\n\tlow\n}\n\nenum FilterMatchCondition {\n\tallof\n\tanyof\n}\n\ntype AddressCondition {\n\theader: String!\n\tpart: String!\n\tstringComparison: String!\n\tcaseSensitive: Boolean\n\tvalue: String!\n\tvalueComparison: String\n\tcountComparison: String\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype BasicCondition {\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype BodyCondition {\n\tcaseSensitive: Boolean\n\tvalue: String\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype ConversationCondition {\n\twhere: String\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype DateCondition {\n\tdateComparison: String\n\tdate: Float # d\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype FlagCondition {\n\tflagName: String!\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype HeaderCheckCondition {\n\theader: String!\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype HeaderCondition {\n\theader: String\n\tstringComparison: String\n\tvalueComparison: String\n\tcountComparison: String\n\tvalue: String\n\tcaseSensitive: Boolean\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype ImportanceCondition {\n\timportance: Importance! # imp\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype InviteCondition {\n\tmethods: [String]\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype MimeHeaderCondition {\n\theader: String\n\tstringComparison: String\n\tvalue: String\n\tcaseSensitive: Boolean\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype SizeCondition {\n\tnumberComparison: String\n\tsize: String # s\n\tindex: Int\n\tnegative: Boolean\n}\n\ntype FilterCondition {\n\tallOrAny: FilterMatchCondition! # condition\n\taddressBook: [HeaderCheckCondition] # addressBookTest\n\taddress: [AddressCondition] # addressTest\n\tattachment: [BasicCondition] # attachmentTest\n\tbody: [BodyCondition] # bodyTest\n\tbulk: [BasicCondition] # bulkTest\n\tcontactRanking: [HeaderCheckCondition] # contactRankingTest\n\tconversation: [ConversationCondition] # conversationTest\n\tdate: [DateCondition] # dateTest\n\tfacebook: [BasicCondition] # facebookTest\n\tflag: [FlagCondition] # flaggedTest\n\theaderExists: [HeaderCheckCondition] # headerExistsTest\n\theader: [HeaderCondition] # headerTest\n\timportance: [ImportanceCondition] # importanceTest\n\tinvite: [InviteCondition] # inviteTest\n\tlinkedin: [BasicCondition] # linkedinTest\n\tlist: [BasicCondition] # listTest\n\tme: [HeaderCheckCondition] # meTest\n\tmimeHeader: [MimeHeaderCondition] # mimeHeaderTest\n\tsize: [SizeCondition] # sizeTest\n\ttwitter: [BasicCondition] # twitterTest\n\tcommunityRequests: [BasicCondition] # communityRequestsTest\n\tcommunityContent: [BasicCondition] # communityContentTest\n\tcommunityConnections: [BasicCondition] # communityConnectionsTest\n}\n\ntype BasicAction {\n\tindex: Int\n}\n\ntype FileIntoAction {\n\tfolderPath: String\n\tcopy: Boolean\n\tindex: Int\n}\n\ntype FlagAction {\n\tflagName: String\n\tindex: Int\n}\n\ntype TagAction {\n\ttagName: String!\n\tindex: Int\n}\n\ntype RedirectAction {\n\taddress: String # a\n\tcopy: Boolean\n\tindex: Int\n}\n\ntype ReplyAction {\n\tindex: Int\n\tcontent: [String]\n}\n\ntype NotifyAction {\n\taddress: String # a\n\tsubject: String # su\n\tmaxBodySize: Int\n\torigHeaders: String\n\tindex: Int\n\tcontent: [String]\n}\n\ntype FilterAction {\n\tkeep: [BasicAction] # actionKeep\n\tdiscard: [BasicAction] # actionDiscard\n\tfileInto: [FileIntoAction] # actionFileInto\n\tflag: [FlagAction] # actionFlag\n\ttag: [TagAction] # actionTag\n\tredirect: [RedirectAction] # actionRedirect\n\treply: [ReplyAction] # actionReply\n\tnotify: [NotifyAction] # actionNotify\n\tstop: [BasicAction] # actionStop\n}\n\ntype Filter {\n\tname: String!\n\tactive: Boolean!\n\n\tactions: [FilterAction] # filterActions\n\tconditions: [FilterCondition] # filterTests\n}\n\n##### End Of Filters ######\n\ntype Folder {\n\tabsFolderPath: String\n\tacl: ACL\n\tcolor: Int\n\tflags: String\n\tid: ID\n\tuuid: ID\n\tname: String\n\toname: String\n\tnonFolderItemCount: Int # Number of non-subfolder items in folder\n\tnonFolderItemCountTotal: Float # Total size of all of non-subfolder items in folder\n\tlinkedFolders: [Folder] # Folders this user has linked from other users nested in this Folder\n\tfolders: [Folder] # Folders nested in this Folder\n\tsearch: [Folder] #smart folders\n\towner: String\n\trevision: Float\n\tview: FolderView\n\tparentFolderId: ID\n\tunread: Int\n\tquery: String\n\tpermissions: String # It will be available on linked folders only\n\townerZimbraId: ID\n\tsharedItemId: ID\n\turl: String\n\tlocal: Boolean\n\tdroppable: Boolean\n\tuserId: ID\n\tbroken: Boolean #shared folder link is broken or not\n\tdeletable: Boolean\n}\n\ntype ACL {\n\tgrant: [ACLGrant]\n}\n\ntype ACLGrant {\n\taddress: String\n\tpermissions: String\n\tgranteeType: GranteeType\n\tzimbraId: ID\n\tpassword: String\n\tkey: String\n}\n\ntype LicenseAttrs {\n\tname: String!\n\t_content: Boolean!\n}\n\ntype License {\n\tstatus: LicenseStatus!\n\tattr: [LicenseAttrs]\n}\n\ntype PropList {\n\tprop: [Prop]\n}\ntype Prop {\n\tzimlet: String\n\tname: String\n\t_content: String\n}\n\ntype AccountInfo {\n\tid: ID!\n\tname: String\n\tpublicURL: String\n\trest: String\n\tused: String\n\tprofileImageId: Int\n\tchangePasswordURL: String\n\tsoapURL: String\n\tversion: String\n\tattrs: AccountInfoAttrs\n\tlicense: License\n\tprops: PropList\n\tzimlets: AccountZimlet\n\tcos: AccountCos\n}\n\ntype OnlyEmailAddress {\n\temailAddress: String\n}\n\ntype Target {\n\tdisplayName: String\n\temail: [OnlyEmailAddress]\n\ttype: String\n}\n\ntype Targets {\n\tright: String\n\ttarget: [Target]\n}\n\ntype DiscoverRights {\n\ttargets: [Targets]\n}\n\ntype AccountZimlet {\n\tzimlet: [AccountZimletInfo]\n}\n\ntype AccountZimletInfo {\n\tzimletContext: [AccountZimletContext]\n\tzimlet: [AccountZimletDesc]\n\tzimletConfig: [AccountZimletConfigInfo]\n}\n\ntype AccountZimletContext {\n\tbaseUrl: String\n\tpriority: Int\n\tpresence: ZimletPresence\n}\n\ntype AccountZimletDesc {\n\tname: String\n\tversion: String\n\tdescription: String\n\textension: String\n\tlabel: String\n\tzimbraXZimletCompatibleSemVer: String\n}\n\ntype AccountZimletConfigInfo {\n\tname: String\n\tversion: String\n\tdescription: String\n\textension: String\n\ttarget: String\n\tlabel: String\n}\n\ntype AccountInfoAttrs {\n\tdisplayName: String\n\tzimbraIsAdminAccount: Boolean\n\tzimbraIsDelegatedAdminAccount: Boolean\n\tzimbraFeatureMailEnabled: Boolean\n\tzimbraFeatureCalendarEnabled: Boolean\n\tzimbraFeatureBriefcasesEnabled: Boolean\n\tzimbraFeatureRelatedContactsEnabled: Boolean\n\tzimbraFeatureChangePasswordEnabled: Boolean\n\tzimbraFeatureResetPasswordStatus: ResetPasswordStatus\n\tzimbraFeatureWebClientOfflineAccessEnabled: Boolean\n\tzimbraMailBlacklistMaxNumEntries: Int\n\tzimbraMailQuota: String\n\tzimbraPublicSharingEnabled: Boolean\n\tzimbraExternalSharingEnabled: Boolean\n\tzimbraFeatureGalEnabled: Boolean\n\tzimbraFeatureGalAutoCompleteEnabled: Boolean\n\tzimbraFeatureOutOfOfficeReplyEnabled: Boolean\n\tzimbraFeatureFiltersEnabled: Boolean\n\tzimbraFeatureReadReceiptsEnabled: Boolean\n\tzimbraFeatureSharingEnabled: Boolean\n\tzimbraFeatureManageZimlets: Boolean\n\tzimbraFeatureTwoFactorAuthAvailable: Boolean\n\tzimbraFeatureTwoFactorAuthRequired: Boolean\n\tzimbraFeatureViewInHtmlEnabled: Boolean\n\tzimbraTwoFactorAuthEnabled: Boolean\n\tzimbraFeatureTrustedDevicesEnabled: Boolean\n\tzimbraFeatureAppSpecificPasswordsEnabled: Boolean\n\tzimbraFeatureMailPriorityEnabled: Boolean\n\tzimbraFileUploadMaxSize: Float\n\tzimbraMailAlias: [String]\n\tzimbraFeatureTaggingEnabled: Boolean\n\tzimbraIdentityMaxNumEntries: Int\n\tzimbraFeatureIdentitiesEnabled: Boolean\n}\n\ntype AccountCos {\n\tname: String\n\tid: ID\n}\n\ntype Identities {\n\tidentity: [Identity]\n}\n\ntype Identity {\n\tid: ID!\n\tname: String\n\t_attrs: IdentityAttrs\n\tdefaultSignature: ID\n}\n\ntype DataSource {\n\tid: ID!\n\tconnectionType: String\n\tdefaultSignature: ID\n\temailAddress: String\n\tl: ID # TODO: Normalize to `folderId`\n\tforwardReplySignature: ID\n\tfromDisplay: String\n\thost: String\n\timportOnly: Boolean\n\tisEnabled: Boolean\n\tname: String\n\tpollingInterval: Float\n\tport: String\n\treplyToAddress: String\n\treplyToDisplay: String\n\tsmtpPort: String\n\tuseAddressForForwardReply: Boolean\n\tusername: String\n\tfailingSince: String\n\tlastError: StringContent\n}\n\ntype Signatures {\n\tsignature: [Signature]\n}\n\ntype Signature {\n\tid: ID\n\tname: String\n\tcontent: [SignatureContent]\n}\n\ntype SignatureContent {\n\ttype: String\n\t_content: String\n}\n\ntype StringContent {\n\t_content: String\n}\n\ntype DataSources {\n\timap: [DataSource]\n\tpop3: [DataSource]\n\tcal: [DataSource]\n}\n\ntype IdentityAttrs {\n\tzimbraPrefIdentityId: ID!\n\tzimbraPrefDefaultSignatureId: ID\n\tzimbraPrefForwardReplySignatureId: ID\n\tzimbraPrefForwardReplyFormat: String\n\tzimbraPrefFromAddress: String\n\tzimbraPrefFromAddressType: String\n\tzimbraPrefFromDisplay: String\n\tzimbraPrefIdentityName: String\n\tzimbraPrefMailSignatureStyle: String\n\tzimbraPrefReplyToAddress: String\n\tzimbraPrefReplyToDisplay: String\n\tzimbraPrefReplyToEnabled: Boolean\n\tzimbraPrefSentMailFolder: String\n}\n\ntype Preferences {\n\tzimbraPrefAutoAddAppointmentsToCalendar: Boolean\n\tzimbraPrefCalendarAutoAddInvites: Boolean\n\tzimbraPrefCalendarFirstDayOfWeek: Int\n\tzimbraPrefCalendarInitialView: PrefCalendarInitialView\n\tzimbraPrefCalendarReminderEmail: String\n\tzimbraPrefCalendarWorkingHours: String\n\tzimbraPrefCalendarApptReminderWarningTime: Int\n\tzimbraPrefCalendarShowPastDueReminders: Boolean\n\tzimbraPrefCalendarToasterEnabled: Boolean,\n\tzimbraPrefComposeDirection: String\n\tzimbraPrefHtmlEditorDefaultFontColor: String,\n\tzimbraPrefHtmlEditorDefaultFontFamily: String,\n\tzimbraPrefHtmlEditorDefaultFontSize: String,\n\tzimbraPrefMailToasterEnabled: Boolean\n\tzimbraPrefShowAllNewMailNotifications: Boolean\n\tzimbraPrefDefaultCalendarId: ID\n\tzimbraPrefDeleteInviteOnReply: Boolean\n\tzimbraPrefDelegatedSendSaveTarget: PrefDelegatedSendSaveTarget\n\tzimbraPrefDisplayExternalImages: Boolean\n\tzimbraPrefGroupMailBy: String\n\tzimbraPrefMailPollingInterval: String\n\tzimbraPrefMailRequestReadReceipts: Boolean\n\tzimbraPrefMailSelectAfterDelete: PrefMailSelectAfterDelete\n\tzimbraPrefMailSendReadReceipts: PrefMailSendReadReceipts\n\tzimbraPrefMailTrustedSenderList: [String]\n\tzimbraPrefMarkMsgRead: Int\n\tzimbraPrefOutOfOfficeFromDate: String\n\tzimbraPrefOutOfOfficeExternalReply: String\n\tzimbraPrefOutOfOfficeExternalReplyEnabled: Boolean\n\tzimbraPrefOutOfOfficeReply: String\n\tzimbraPrefOutOfOfficeReplyEnabled: Boolean\n\tzimbraPrefOutOfOfficeStatusAlertOnLogin: Boolean\n\tzimbraPrefOutOfOfficeSuppressExternalReply: Boolean\n\tzimbraPrefOutOfOfficeUntilDate: String\n\tzimbraPrefReadingPaneEnabled: Boolean\n\tzimbraPrefReadingPaneLocation: ReadingPaneLocation\n\tzimbraPrefPasswordRecoveryAddress: String\n\tzimbraPrefPasswordRecoveryAddressStatus: PasswordRecoveryAddressStatus\n\tzimbraPrefSaveToSent: Boolean\n\tzimbraPrefShowFragments: Boolean\n\tzimbraPrefSlackCalendarReminderEnabled: Boolean\n\tzimbraPrefSortOrder: String\n\tzimbraPrefWebClientOfflineBrowserKey: String\n\tzimbraPrefTimeZoneId: String\n\tzimbraPrefLocale: String\n\tzimbraPrefClientType: PrefClientType\n\tzimbraPrefAppleIcalDelegationEnabled: Boolean\n\tzimbraPrefCalendarShowDeclinedMeetings: Boolean\n\tzimbraPrefUseTimeZoneListInCalendar: Boolean\n\tzimbraPrefMailForwardingAddress: String\n\tzimbraPrefMailLocalDeliveryDisabled: Boolean\n\tzimbraPrefTagTreeOpen: Boolean\n}\n\ntype GetAppointmentResponse {\n\tappointment: [AppointmentInfo]\n}\n\ntype NameId {\n\tid: ID\n\tname: String\n}\n\ntype SignatureResponse {\n\tsignature: [NameId]\n}\n\ntype Document {\n\tid: ID #id\n\tfolderId: ID #l\n\tname: String #name\n\tversion: Float #same item may have different versions (i.e same names) will need to implement ListDocumentRevisionsRequest\n\tcontentType: String #ct\n \tdescriptionEnabled: Boolean #descEnabled\n\tdate: Float #l\n\tchangeDate: Float #md\n\tmodifiedSequence: Float #ms\n\trevision: Float #rev\n\tsize: Float #s\n\tsortField: String #sf\n\ttags: String # t\n\ttagNames: String # tn\n\tuuid: ID #uuid\n\tfolderUuid: String #luuid\n\tmetadataVersion: Float #mdver\n\tlastEditedAccount: String #leb\n\trevisonCreator: String #cr\n\trevisedCreationDate: Float #cd\n\tlockOwnerId: ID #loid\n}\n\n\ntype SearchResponse {\n\tcontacts: [Contact]\n\tmessages: [MessageInfo]\n\tconversations: [Conversation]\n\ttasks: [CalendarItemHitInfo]\n\tappointments: [CalendarItemHitInfo]\n\tdocuments: [Document]\n\tmore: Boolean\n\toffset: Int\n\tsortBy: String\n\tpaginationSupported: Boolean\n\thit: [Hit]\n}\n\ntype RemindersResponse {\n\ttasks: [ReminderItemHitInfo]\n\tappointments: [ReminderItemHitInfo]\n}\n\ntype Hit {\n\tid: String\n\tsortField: String\n}\n\ntype SendMessageResponse {\n\tmessage: [MsgWithGroupInfo]\n}\n\ntype SaveDraftResponse {\n\tmessage: [MessageInfo]\n}\n\ntype CustomMetadataAttrs {\n\tkey: String\n\tvalue: String\n}\n\ntype CustomMetadataMeta {\n\tsection: String!\n\t_attrs: [CustomMetadataAttrs]\n}\n\ntype CustomMetadata {\n\tmeta: [CustomMetadataMeta]\n}\n\ntype Contact {\n\tid: ID!\n\tdate: Float\n\tfolderId: ID\n\trevision: Float\n\tsortField: String\n\tfileAsStr: String\n\tmemberOf: String\n\ttags: String # t\n\ttagNames: String # tn\n\tattributes: ContactAttributes\n\tmembers: [ContactListMember]\n}\n\ntype OtherContactAttribute {\n\tkey: String\n\tvalue: String\n}\n\ntype ContactAttributes {\n\tfirstName: String\n\tmiddleName: String\n\tlastName: String\n\tfullName: String\n\tmaidenName: String\n\tnamePrefix: String\n\tnameSuffix: String\n\temail: String\n\temail2: String\n\tworkEmail: String\n\tworkEmail2: String\n\thomeEmail: String\n\thomeEmail2: String\n\tphone: String\n\tphone2: String\n\tcompanyPhone: String\n\tcompanyPhone2: String\n\totherPhone: String\n\totherPhone2: String\n\tmobilePhone: String\n\tmobilePhone2: String\n\thomePhone: String\n\thomePhone2: String\n\tworkPhone: String\n\tworkPhone2: String\n\tpager: String\n\tpager2: String\n\thomeFax: String\n\thomeFax2: String\n\tworkFax: String\n\tworkFax2: String\n\timAddress: String\n\timAddress1: String\n\timAddress2: String\n\timAddress3: String\n\timAddress4: String\n\timAddress5: String\n\tnickname: String\n\thomeStreet: String\n\thomeCity: String\n\thomeState: String\n\thomePostalCode: String\n\thomeCountry: String\n\thomeURL: String\n\tworkStreet: String\n\tworkCity: String\n\tworkState: String\n\tworkPostalCode: String\n\tworkCountry: String\n\tworkURL: String\n\tjobTitle: String\n\tcompany: String\n\tdepartment: String\n\tbirthday: String\n\tanniversary: String\n\twebsite: String\n\tnotes: String\n\tthumbnailPhoto: String\n\timage: ContactImage\n\tuserCertificate: String\n\tzimbraCalResType: String\n\tassistantPhone: String\n\tcallbackPhone: String\n\tcarPhone: String\n\totherCity: String\n\totherCountry: String\n\totherFax: String\n\totherPostalCode: String\n\totherState: String\n\totherStreet: String\n\totherURL: String\n\n\t# Used for contact lists\n\tfileAs: String\n\ttype: String\n\tother: [OtherContactAttribute]\n}\n\ntype ContactImage {\n\tcontentType: String\n\tfilename: String\n\tpart: String\n\tsize: String\n}\n\ntype ContactListMember {\n\tcontacts: [Contact]\n\ttype: ContactType!\n\tvalue: ID!\n}\n\ntype Tag {\n\tid: ID\n\tname: String\n\tcolor: Int\n\tunread: Int\n}\n\ninput OtherContactAttributeInput {\n\tkey: String\n\tvalue: String\n}\n\ninput ClientInfoInput {\n\tdomain: String\n}\n\ninput ContactAttrsInput {\n\tfirstName: String\n\tmiddleName: String\n\tlastName: String\n\tfullName: String\n\tmaidenName: String\n\tnamePrefix: String\n\tnameSuffix: String\n\temail: String\n\temail2: String\n\tworkEmail: String\n\tworkEmail2: String\n\thomeEmail: String\n\thomeEmail2: String\n\tphone: String\n\tphone2: String\n\tcompanyPhone: String\n\tcompanyPhone2: String\n\totherPhone: String\n\totherPhone2: String\n\tmobilePhone: String\n\tmobilePhone2: String\n\thomePhone: String\n\thomePhone2: String\n\tworkPhone: String\n\tworkPhone2: String\n\tpager: String\n\tpager2: String\n\thomeFax2: String\n\tworkFax2: String\n\timAddress: String\n\timAddress1: String\n\timAddress2: String\n\timAddress3: String\n\timAddress4: String\n\timAddress5: String\n\tnickname: String\n\thomeStreet: String\n\thomeCity: String\n\thomeFax: String\n\thomeState: String\n\thomePostalCode: String\n\thomeCountry: String\n\thomeURL: String\n\tworkFax: String\n\tworkStreet: String\n\tworkCity: String\n\tworkState: String\n\tworkPostalCode: String\n\tworkCountry: String\n\tworkURL: String\n\tjobTitle: String\n\tcompany: String\n\tdepartment: String\n\tbirthday: String\n\tanniversary: String\n\twebsite: String\n\tnotes: String\n\timage: String\n\tuserCertificate: String\n\tassistantPhone: String\n\tcallbackPhone: String\n\tcarPhone: String\n\totherCity: String\n\totherCountry: String\n\totherFax: String\n\totherPostalCode: String\n\totherState: String\n\totherStreet: String\n\totherURL: String\n\n\t# Used for contact lists\n\tfileAs: String\n\ttype: String\n\tother: [OtherContactAttributeInput]\n}\n\ninput CreateContactInput {\n\tfolderId: ID\n\ttagNames: String\n\tattributes: ContactAttrsInput!\n}\n\ninput ContactListOps {\n\top: String!\n\ttype: String!\n\tvalue: String!\n}\n\ninput ModifyContactInput {\n\tid: ID!\n\tfolderId: ID\n\ttagNames: String\n\tattributes: ContactAttrsInput!\n\tmemberOps: [ContactListOps]\n}\n\ntype RelatedContact {\n\temail: String\n\tscope: Int\n\tp: String\n}\n\ntype ContactFrequencyResponse {\n\tdata: [ContactFrequencyData]\n}\n\ntype ContactFrequencyData {\n\tby: String\n\tdataPoint: [ContactFrequencyDataPoints]\n}\n\ntype ContactFrequencyDataPoints {\n\tlabel: Float\n\tvalue: Int\n}\n\ninput CustomMetadataAttrsInput {\n\tkey: String\n\tvalue: String\n}\n\ninput CustomMetadataInput {\n\tid: ID!\n\tsection: String\n\tattrs: [CustomMetadataAttrsInput]\n}\n\n\ninput EmailAddressInput {\n\temail: String!\n\tname: String!\n\tshortName: String!\n}\n\ntype ShareInfo {\n\tfolderId: ID!\n\tfolderPath: String\n\tfolderUuid: String\n\tgranteeName: String\n\tgranteeDisplayName: String\n\tgranteeId: String\n\tgranteeType: String\n\townerEmail: String\n\townerId: String\n\townerName: String\n\trights: String\n\tview: FolderView\n\tmid: ID\n}\n\ntype MailboxMetadataAttrs {\n\tzimbraPrefCustomFolderTreeOpen: Boolean\n\tzimbraPrefDateFormat: String\n\tzimbraPrefSharedFolderTreeOpen: Boolean\n\tzimbraPrefFoldersExpanded: String\n\tzimbraPrefFolderTreeSash: Int\n\tzimbraPrefGenerateLinkPreviews: Boolean\n\tzimbraPrefGroupByList: String\n\tzimbraPrefMessageListDensity: String\n\tzimbraPrefMultitasking: String\n\tzimbraPrefReadingPaneSashHorizontal: Int\n\tzimbraPrefReadingPaneSashVertical: Int\n\tzimbraPrefSmartFolderTreeOpen: Boolean\n\tzimbraPrefTimeFormat: String\n\tzimbraPrefUndoSendEnabled: Boolean\n\tzimbraPrefUndoSendTimeout: Int\n\tarchivedFolder: String\n\tzimbraPrefSMIMEDefaultSetting: String\n\tzimbraPrefSMIMELastOperation: String\n\tzimbraPrefContactSourceFolderID: String\n}\n\ntype MailboxMetadataMeta {\n\tsection: String!\n\t_attrs: MailboxMetadataAttrs!\n}\n\ntype MailboxMetadata {\n\tmeta: [MailboxMetadataMeta]\n}\n\ninput MailboxMetadataSectionAttrsInput {\n\tzimbraPrefCustomFolderTreeOpen: Boolean\n\tzimbraPrefDateFormat: String\n\tzimbraPrefSharedFolderTreeOpen: Boolean\n\tzimbraPrefFoldersExpanded: String\n\tzimbraPrefFolderTreeSash: Int\n\tzimbraPrefGenerateLinkPreviews: Boolean\n\tzimbraPrefGroupByList: String\n\tzimbraPrefMessageListDensity: String\n\tzimbraPrefMultitasking: String\n\tzimbraPrefReadingPaneSashHorizontal: Int\n\tzimbraPrefReadingPaneSashVertical: Int\n\tzimbraPrefSmartFolderTreeOpen: Boolean\n\tzimbraPrefTimeFormat: String\n\tzimbraPrefUndoSendEnabled: Boolean\n\tzimbraPrefUndoSendTimeout: Int\n\tarchivedFolder: String\n\tzimbraPrefSMIMEDefaultSetting: String\n\tzimbraPrefSMIMELastOperation: String\n\tzimbraPrefContactSourceFolderID: String\n}\n\ntype MimePart {\n\tbody: Boolean\n\tfilename: String\n\tpart: ID # Mime part name\n\tcontent: String\n\tcontentId: String\n\tcontentType: String\n\tcontentDisposition: String\n\tsize: Float # Size in bytes\n\tmimeParts: [MimePart]\n\turl: String\n\tmessageId: ID\n}\n\ninput MimePartInput {\n\tbody: Boolean\n\tfilename: String\n\tpart: ID # Mime part name\n\tcontent: String\n\tcontentId: String\n\tcontentType: String\n\tcontentDisposition: String\n\tsize: Float # Size in bytes\n\tmimeParts: [MimePartInput]\n\turl: String\n\tmessageId: ID\n\tattachments: [AttachmentInput]\n}\n\ninput ExistingAttachmentInput {\n\tmessageId: ID\n\tpart: String\n}\n\ninput DocumentInput {\n\tid: ID\n}\n\ninput AttachmentInput {\n\tattachmentId: String\n\tdocuments: [DocumentInput]\n\texistingAttachments: [ExistingAttachmentInput]\n}\n\ntype AutoCompleteResponse {\n\tcanBeCached: Boolean\n\tmatch: [AutoCompleteMatch]\n}\n\ntype AutoCompleteGALResponse {\n\tcontacts: [Contact]\n}\n\ntype AutoCompleteMatch {\n\temail: String\n\ttype: AutoCompleteMatchType\n\tranking: Int\n\tisGroup: Boolean\n\texp: Boolean\n\tid: ID\n\tfolderId: ID\n\tdisplay: String\n\tfirst: String\n\tmiddle: String\n\tlast: String\n\tfull: String\n\tnick: String\n\tcompany: String\n\tfileas: String\n}\n\ninput CalendarItemInput {\n\tid: ID\n\tmodifiedSequence: Float\n\trevision: Float\n\tcomponentNum: Int # comp\n\tmessage: CalendarItemMessageInput!\n}\n\ninput CalendarItemMessageInput {\n\tfolderId: ID #l\n\tsubject: String #su\n\tinvitations: CalendarItemInviteInput #inv\n\tmimeParts: [MimePartInput] #mp\n\temailAddresses: [MailItemEmailAddressInput] #e\n\tattachments: [AttachmentInput] #attach\n\treplyType: InviteReplyType #rt\n}\n\ninput CounterAppointmentInput {\n\tid: ID!\n\tmodifiedSequence: Float\n\trevision: Float\n\tcomponentNum: Int # comp\n\tmessage: CounterAppointmentMessageInput!\n}\n\ninput CounterAppointmentMessageInput {\n\torigId: ID #origid\n\tfolderId: ID #l\n\tsubject: String #su\n\tinvitations: CalendarCounterAppointmentInput #inv\n\tmimeParts: [MimePartInput] #mp\n\temailAddresses: [MailItemEmailAddressInput] #e\n\tattachments: [AttachmentInput] #attach\n\treplyType: InviteReplyType #rt\n}\n\ninput SendMessageInput {\n\tid: ID #id\n\torigId: ID #origid\n\tfolderId: ID # l\n\tattach: [AttachmentInput]\n\tattachmentId: ID #aid\n\treplyType: String #rt\n\tinReplyTo: String #irt\n\tflags: String #f\n\tautoSendTime: Float #autoSendTime\n\tdraftId: ID #did\n\tentityId: String #idnt\n\tsubject: String #su\n\tmimeParts: [MimePartInput] #mp\n\temailAddresses: [MailItemEmailAddressInput] #e\n\tattachments: [AttachmentInput] #attach\n}\n\ninput CalendarItemInviteInput {\n\tcomponents: [CalendarItemInviteComponentInput]!\n}\n\ninput CalendarCounterAppointmentInput {\n\tcomponents: [CalendarItemInviteComponentCounterInput]!\n}\n\ninput MailItemEmailAddressInput {\n\taddress: String!\n\tname: String\n\ttype: AddressType!\n}\n\ninput CalendarItemInviteComponentInput {\n\tname: String\n\tlocation: String\n\tstart: CalendarItemDateTimeInput\n\tend: CalendarItemDateTimeInput\n\texceptId: CalendarOptionalItemDateTimeInput\n\tfreeBusy: FreeBusyStatus\n\tallDay: Boolean\n\torganizer: CalendarItemOrganizerInput\n\trecurrence: CalendarItemRecurrenceInput\n\tattendees: [CalendarItemAttendeesInput]\n\talarms: [CalendarItemAlarmInput]\n\tclass: CalendarItemClass!\n\tpriority: String\n\tpercentComplete: String\n\tstatus: InviteCompletionStatus\n\tnoBlob: Boolean\n\tdescription: [CalendarItemInviteComponentDescriptionInput]\n\tdraft: Boolean\n}\n\ninput CalendarItemInviteComponentDescriptionInput {\n\t_content: String\n}\n\ninput CalendarItemDateTimeInput {\n\ttimezone: String\n\tdate: String!\n}\n\ninput CalendarOptionalItemDateTimeInput {\n\ttimezone: String\n\tdate: String\n}\n\ninput CalendarItemInviteComponentCounterInput {\n\tname: String!\n\tlocation: String\n\tstart: CalendarItemDateTimeInput!\n\tend: CalendarItemDateTimeInput!\n\texceptId: CalendarOptionalItemDateTimeInput\n\tfreeBusy: FreeBusyStatus\n\tallDay: Boolean\n\torganizer: CalendarItemOrganizerInput\n\trecurrence: CalendarItemRecurrenceInput\n\tattendees: [CalendarItemAttendeesInput]\n\talarms: [CalendarItemAlarmInput]\n\tclass: CalendarItemClass\n\tuid: String\n\tpriority: String\n\tpercentComplete: String\n\tstatus: InviteCompletionStatus\n\tnoBlob: Boolean\n\tdescription: [CalendarItemInviteComponentDescriptionInput]\n\tdraft: Boolean\n}\n\ntype CalendarItemAttendee {\n\trole: ParticipationRole\n\tparticipationStatus: ParticipationStatus\n\trsvp: Boolean\n\taddress: String\n\tname: String\n\tcalendarUserType: String\n}\n\ntype CalendarItemReply {\n\tparticipationStatus: ParticipationStatus\n\tattendee: String\n}\n\ninput CalendarItemAttendeesInput {\n\trole: ParticipationRole\n\tparticipationStatus: ParticipationStatus\n\trsvp: Boolean\n\taddress: String!\n\tname: String\n\tcalendarUserType: String\n}\n\ntype CalendarItemAlarmTriggerRelative {\n\tweeks: Int\n\tdays: Int\n\thours: Int\n\tminutes: Int\n\tseconds: Int\n\trelatedTo: AlarmRelatedTo\n\tnegative: Boolean\n}\n\ntype CalendarItemAlarmAttendees {\n\temail: String!\n}\n\ntype CalendarItemAlarmTrigger {\n\trelative: [CalendarItemAlarmTriggerRelative]\n}\n\ntype CalendarItemAlarm {\n\taction: AlarmAction!\n\ttrigger: [CalendarItemAlarmTrigger]\n\tattendees: [CalendarItemAlarmAttendees]\n}\n\ntype RecoverAccount {\n\trecoveryAccount: String\n\trecoveryAttemptsLeft: Int\n}\n\ntype WhiteBlackAddress {\n\t_content: String!\n\top: String\n}\n\ntype WhiteBlackListArr {\n\taddr: [WhiteBlackAddress]\n}\n\ntype WhiteBlackList {\n\twhiteList: [WhiteBlackListArr]!\n\tblackList: [WhiteBlackListArr]!\n}\n\ninput CalendarItemAlarmInput {\n\taction: AlarmAction!\n\ttrigger: CalendarItemAlarmTriggerInput!\n\tattendees: CalendarItemAlarmAttendeesInput\n}\n\ninput CalendarItemAlarmAttendeesInput {\n\temail: String!\n}\n\ninput CalendarItemAlarmTriggerInput {\n\trelative: CalendarItemAlarmTriggerRelativeInput\n\tabsolute: CalendarItemAlarmTriggerAbsoluteInput\n}\n\ninput CalendarItemAlarmTriggerRelativeInput {\n\tweeks: Int\n\tdays: Int\n\thours: Int\n\tminutes: Int\n\tseconds: Int\n\trelatedTo: AlarmRelatedTo\n\tnegative: Boolean\n}\n\ninput CalendarItemAlarmTriggerAbsoluteInput {\n\tdate: String!\n}\n\ninput CalendarItemOrganizerInput {\n\taddress: String\n\tname: String\n\tsentBy: String\n}\n\ninput CalendarItemRecurrenceInput {\n\tadd: CalendarItemRecurrenceAddInput\n}\n\ninput CalendarItemRecurrenceAddInput {\n\trule: CalendarItemRecurrenceRuleInput\n}\n\ninput CalendarItemRecurrenceRuleInput {\n\tinterval: CalendarItemRecurrenceIntervalInput\n\tfrequency: CalendarItemRecurrenceFrequency\n\tcount: CalendarItemRecurrenceEndCountInput\n\tuntil: CalendarItemRecurrenceEndDateInput\n\tbyday: CalendarItemRecurrenceByDayInput\n\tbymonthday: CalendarItemRecurrenceByMonthDayInput\n\tbymonth: CalendarItemRecurrenceByMonthInput\n\tbysetpos: CalendarItemRecurrenceBySetPosInput\n}\n\ninput CalendarItemRecurrenceIntervalInput {\n\tintervalCount: Int!\n\tzimbraPrefAutoAddAppointmentsToCalendar: Boolean\n}\n\ninput CalendarItemRecurrenceEndCountInput {\n\tnumber: Int!\n}\n\ninput CalendarItemRecurrenceEndDateInput {\n\tdate: String!\n}\n\ninput CalendarItemRecurrenceByDayInput {\n\twkday: [WkDayInput]\n}\n\ninput WkDayInput {\n\tday: Weekday!\n\tordwk: Int\n}\n\ninput CalendarItemRecurrenceByMonthDayInput {\n\tdayList: String!\n}\n\ninput CalendarItemRecurrenceByMonthInput {\n\tmonthList: Int!\n}\n\ninput CalendarItemRecurrenceBySetPosInput {\n\tposlist: Int!\n}\n\ninput NewMountpointSpec {\n\tname: String!\n\towner: String\n\tview: SearchType\n\tflags: String\n\townerZimbraId: ID # zid\n\tsharedItemId: ID # rid\n\tcolor: Int\n\treminder: Boolean\n\tparentFolderId: ID\n}\n\ninput CreateMountpointInput {\n\tlink: NewMountpointSpec\n}\n\ninput FolderQueryInput {\n\tuuid: ID\n\tid: ID\n\tview: FolderView\n}\n\ninput FolderActionInput {\n\tid: ID!\n\top: String!\n\tgrant: [GrantInput]\n\tname: String\n\tfolderId: ID\n\tzimbraId: ID\n\tcolor: Int\n}\n\ninput CreateTagInput {\n\tname: String!\n\tcolor: Int\n}\n\n# Special case of FolderAction for `changeFolderColor` resolver\ninput FolderActionChangeColorInput {\n\tid: ID!\n\tcolor: Int!\n}\n\n# Special case of FolderAction for `checkCalendar` resolver\ninput FolderActionCheckCalendarInput {\n\tid: ID!\n\tvalue: Boolean\n}\n\ninput ContactFrequencySpec {\n\trange: String!\n\tinterval: String!\n}\n\ninput GrantInput {\n\taddress: String\n\tgranteeType: GranteeType!\n\tkey: String\n\tpassword: String\n\tpermissions: String!\n\tzimbraId: ID\n}\n\ninput Right {\n\tright: String!\n}\n\ninput GetRightsInput {\n\taccess: [Right]\n}\ninput GrantRightsInput {\n\taccess: [AccountACEInfoInput]\n}\n\ninput RevokeRightsInput {\n\taccess: [AccountACEInfoInput]\n}\n\n# Used by GrantRightsRequest\ninput AccountACEInfoInput {\n\tzimbraId: ID\n\tgranteeType: GranteeType!\n\tright: String!\n\taddress: String\n\tkey: String\n\tpassword: String\n\tdeny: Boolean\n\tcheckGrantee: Boolean\n}\n\ninput InviteReplyInput {\n\tcomponentNum: Int! #compNum\n\tid: ID!\n\tverb: InviteReplyVerb!\n\tupdateOrganizer: Boolean\n\tmessage: CalendarItemMessageInput\n\texceptId: InstanceDate\n}\n\ninput PropertiesInput {\n\tzimlet: String!\n\tname: String!\n\t_content: String\n}\n\ninput PreferencesInput {\n\tzimbraPrefAutoAddAppointmentsToCalendar: Boolean\n\tzimbraPrefCalendarAutoAddInvites: Boolean\n\tzimbraPrefDefaultCalendarId: ID\n\tzimbraPrefCalendarFirstDayOfWeek: Int\n\tzimbraPrefCalendarInitialView: PrefCalendarInitialView\n\tzimbraPrefCalendarReminderEmail: String\n\tzimbraPrefCalendarWorkingHours: String\n\tzimbraPrefCalendarApptReminderWarningTime: Int\n\tzimbraPrefCalendarShowPastDueReminders: Boolean\n\tzimbraPrefCalendarToasterEnabled: Boolean,\n\tzimbraPrefComposeDirection: String,\n\tzimbraPrefHtmlEditorDefaultFontColor: String,\n\tzimbraPrefHtmlEditorDefaultFontFamily: String,\n\tzimbraPrefHtmlEditorDefaultFontSize: String,\n\tzimbraPrefMailToasterEnabled: Boolean\n\tzimbraPrefShowAllNewMailNotifications: Boolean\n\tzimbraPrefDelegatedSendSaveTarget: PrefDelegatedSendSaveTarget\n\tzimbraPrefDisplayExternalImages: Boolean\n\tzimbraPrefGroupMailBy: String\n\tzimbraPrefMailPollingInterval: String\n\tzimbraPrefMailRequestReadReceipts: Boolean\n\tzimbraPrefMailSelectAfterDelete: PrefMailSelectAfterDelete\n\tzimbraPrefMailSendReadReceipts: PrefMailSendReadReceipts\n\tzimbraPrefMailTrustedSenderList: [String]\n\tzimbraPrefMarkMsgRead: Int\n\tzimbraPrefOutOfOfficeFromDate: String\n\tzimbraPrefOutOfOfficeExternalReply: String\n\tzimbraPrefOutOfOfficeExternalReplyEnabled: Boolean\n\tzimbraPrefOutOfOfficeReply: String\n\tzimbraPrefOutOfOfficeReplyEnabled: Boolean\n\tzimbraPrefOutOfOfficeStatusAlertOnLogin: Boolean\n\tzimbraPrefOutOfOfficeSuppressExternalReply: Boolean\n\tzimbraPrefOutOfOfficeUntilDate: String\n\tzimbraPrefReadingPaneEnabled: Boolean\n\tzimbraPrefReadingPaneLocation: ReadingPaneLocation\n\tzimbraPrefSaveToSent: Boolean\n\tzimbraPrefShowFragments: Boolean\n\tzimbraPrefSlackCalendarReminderEnabled: Boolean\n\tzimbraPrefSortOrder: String\n\tzimbraPrefWebClientOfflineBrowserKey: String\n\tzimbraPrefTimeZoneId: String\n\tzimbraPrefLocale: String\n\tzimbraPrefClientType: PrefClientType\n\tzimbraPrefAppleIcalDelegationEnabled: Boolean\n\tzimbraPrefCalendarShowDeclinedMeetings: Boolean\n\tzimbraPrefUseTimeZoneListInCalendar: Boolean\n\tzimbraPrefMailForwardingAddress: String\n\tzimbraPrefMailLocalDeliveryDisabled: Boolean\n\tzimbraPrefTagTreeOpen: Boolean\n}\n\ninput ModifyIdentityInput {\n\tid: ID!\n\tattrs: IdentityAttrsInput\n}\n\ninput DeleteIdentityInput {\n\tid: ID!\n\tname: String\n}\n\ninput CreateIdentityInput {\n\tname: String!\n\tattrs: IdentityAttrsInput\n}\n\ninput ZimletPreferenceInput {\n\tname: String!\n\tpresence: String!\n}\n\n##### FilterInput #####\n\ninput AddressConditionInput {\n\theader: String!\n\tpart: String!\n\tstringComparison: String!\n\tcaseSensitive: Boolean\n\tvalue: String!\n\tvalueComparison: String\n\tcountComparison: String\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput BasicConditionInput {\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput BodyConditionInput {\n\tcaseSensitive: Boolean\n\tvalue: String\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput ConversationConditionInput {\n\twhere: String\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput DateConditionInput {\n\tdateComparison: String\n\tdate: Float # d\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput FlagConditionInput {\n\tflagName: String!\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput HeaderCheckConditionInput {\n\theader: String!\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput HeaderConditionInput {\n\theader: String\n\tstringComparison: String\n\tvalueComparison: String\n\tcountComparison: String\n\tvalue: String\n\tcaseSensitive: Boolean\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput ImportanceConditionInput {\n\timportance: Importance! # imp\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput InviteConditionInput {\n\tmethods: [String]\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput MimeHeaderConditionInput {\n\theader: String\n\tstringComparison: String\n\tvalue: String\n\tcaseSensitive: Boolean\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput SizeConditionInput {\n\tnumberComparison: String\n\tsize: String # s\n\tindex: Int\n\tnegative: Boolean\n}\n\ninput FilterConditionInput {\n\tallOrAny: FilterMatchCondition! # condition\n\taddressBook: [HeaderCheckConditionInput] # addressBookTest\n\taddress: [AddressConditionInput] # addressTest\n\tattachment: [BasicConditionInput] # attachmentTest\n\tbody: [BodyConditionInput] # bodyTest\n\tbulk: [BasicConditionInput] # bulkTest\n\tcontactRanking: [HeaderCheckConditionInput] # contactRankingTest\n\tconversation: [ConversationConditionInput] # conversationTest\n\tdate: [DateConditionInput] # dateTest\n\tfacebook: [BasicConditionInput] # facebookTest\n\tflag: [FlagConditionInput] # flaggedTest\n\theaderExists: [HeaderCheckConditionInput] # headerExistsTest\n\theader: [HeaderConditionInput] # headerTest\n\timportance: [ImportanceConditionInput] # importanceTest\n\tinvite: [InviteConditionInput] # inviteTest\n\tlinkedin: [BasicConditionInput] # linkedinTest\n\tlist: [BasicConditionInput] # listTest\n\tme: [HeaderCheckConditionInput] # meTest\n\tmimeHeader: [MimeHeaderConditionInput] # mimeHeaderTest\n\tsize: [SizeConditionInput] # sizeTest\n\ttwitter: [BasicConditionInput] # twitterTest\n\tcommunityRequests: [BasicConditionInput] # communityRequestsTest\n\tcommunityContent: [BasicConditionInput] # communityContentTest\n\tcommunityConnections: [BasicConditionInput] # communityConnectionsTest\n}\n\ninput BasicActionInput {\n\tindex: Int\n}\n\ninput FileIntoActionInput {\n\tfolderPath: String\n\tcopy: Boolean\n\tindex: Int\n}\n\ninput FlagActionInput {\n\tflagName: String\n\tindex: Int\n}\n\ninput TagActionInput {\n\ttagName: String!\n\tindex: Int\n}\n\ninput RedirectActionInput {\n\taddress: String # a\n\tcopy: Boolean\n\tindex: Int\n}\n\ninput ReplyActionInput {\n\tindex: Int\n\tcontent: [String]\n}\n\ninput NotifyActionInput {\n\taddress: String # a\n\tsubject: String # su\n\tmaxBodySize: Int\n\torigHeaders: String\n\tindex: Int\n\tcontent: [String]\n}\n\ninput FilterActionInput {\n\tkeep: [BasicActionInput] # actionKeep\n\tdiscard: [BasicActionInput] # actionDiscard\n\tfileInto: [FileIntoActionInput] # actionFileInto\n\tflag: [FlagActionInput] # actionFlag\n\ttag: [TagActionInput] # actionTag\n\tredirect: [RedirectActionInput] # actionRedirect\n\treply: [ReplyActionInput] # actionReply\n\tnotify: [NotifyActionInput] # actionNotify\n\tstop: [BasicActionInput] # actionStop\n}\n\ninput FilterInput {\n\tname: String!\n\tactive: Boolean!\n\n\tactions: [FilterActionInput] # filterActions\n\tconditions: [FilterConditionInput] # filterTests\n}\n\ninput FilterRuleInput {\n\tname: String!\n}\n\n##### End Of FilterInput #####\n\ninput ForwardExceptIdInput {\n\ttimezone: String!\n\tdate: String!\n}\n\ninput ForwardAppointmentInput {\n\tid: ID!\n\tmessage: ForwardMessageInput!\n\texceptId: ForwardExceptIdInput\n}\n\ninput ForwardAppointmentInviteInput {\n\tid: ID!\n\tmessage: ForwardMessageInput!\n}\n\ninput ForwardMessageInput {\n\tsubject: String #su\n\tmimeParts: [MimePartInput] #mp\n\temailAddresses: [MailItemEmailAddressInput] #e\n}\n\n\ninput ShareNotificationInput {\n\taction: ShareInputAction\n\titem: ShareNotificationItemInput!\n\taddress: ShareNotificaitonEmailAddressInput!\n\tnotes: String\n}\n\ninput ShareNotificationItemInput {\n\tid: ID!\n}\n\ninput ShareNotificaitonEmailAddressInput {\n\taddress: String!\n\ttype: AddressType\n\tpersonalName: String\n}\n\ninput IdentityAttrsInput {\n\tzimbraPrefIdentityId: ID\n\tzimbraPrefDefaultSignatureId: ID\n\tzimbraPrefForwardReplySignatureId: ID\n\tzimbraPrefForwardReplyFormat: String\n\tzimbraPrefFromAddress: String\n\tzimbraPrefFromAddressType: String\n\tzimbraPrefFromDisplay: String\n\tzimbraPrefIdentityName: String\n\tzimbraPrefMailSignatureStyle: String\n\tzimbraPrefReplyToAddress: String\n\tzimbraPrefReplyToDisplay: String\n\tzimbraPrefReplyToEnabled: Boolean\n\tzimbraPrefSentMailFolder: String\n}\n\ninput ExternalAccountAddInput {\n\taccountType: AccountType\n\tconnectionType: ConnectionType\n\temailAddress: String\n\thost: String!\n\tisEnabled: Boolean\n\tl: ID! # TODO: Normalize to `folderId`\n\tleaveOnServer: Boolean\n\tname: String!\n\tpassword: String!\n\tport: String!\n\tusername: String!\n}\n\ninput ExternalAccountTestInput {\n\taccountType: AccountType\n\tconnectionType: ConnectionType\n\temailAddress: String\n\thost: String!\n\tleaveOnServer: Boolean\n\tport: String!\n\tusername: String!\n\tpassword: String!\n}\n\ninput ExternalAccountModifyAttrsInput {\n\tid: ID\n\taccountType: AccountType\n\tdefaultSignature: ID\n\tdescription: String\n\temailAddress: String\n\tfromDisplay: String\n\tname: String\n\treplyToAddress: String\n\treplyToDisplay: String\n\treplyToEnabled: Boolean\n\tstoreAndForward: String\n\tuseAddressForForwardReply: Boolean\n\tusername: String\n\thost: String\n\tsignatureValue: String\n\timportOnly: Boolean\n\tforwardReplySignature: ID\n\tconnectionType: ConnectionType\n\tisEnabled: Boolean\n\tport: String\n\tsmtpPort: String\n}\ninput EnableTwoFactorAuthInput {\n\tname: String!\n\tpassword: String\n\ttwoFactorCode: String\n\tauthToken: String\n\tcsrfTokenSecured: Boolean!\n}\n\ninput ExternalAccountImportInput {\n\taccountType: AccountType\n\tid: ID!\n}\n\n# Include one of these fields to query for a folder\ninput GetFolderFolderInput {\n\tuuid: ID\n\tparentFolderId: ID # Folder ID\n\tpath: String # Fully qualifed folder path\n}\n\ninput Cursor {\n\tid: ID\n\tsortField: String\n\tendSortVal: String\n\tincludeOffset: Boolean\n}\n\ninput MailItemHeaderInput {\n\tn: String!\n}\n\ninput NameIdInput {\n\tid: ID\n\tname: String\n}\ninput InstanceDate {\n\tdate: String\n}\ninput DeleteAppointmentInput {\n\tinstanceDate: InstanceDate\n\tinviteId: String!\n\tcomponentNum: String!\n\tstart: Int\n\tmessage: CalendarItemMessageInput\n}\ninput SignatureInput {\n\tid: ID\n\tname: String\n\tcontent: SignatureContentInput\n\tcontentId: String\n}\n\ninput SearchFolderInput {\n\tid: ID!\n\tquery: String!\n\ttypes: FolderView!\n}\n\ninput SignatureContentInput {\n\ttype: String\n\t_content: String\n}\n\ninput WhiteBlackAddressOpts {\n\t_content: String!\n\top: String\n}\n\ninput WhiteBlackListArrInput {\n\taddr: [WhiteBlackAddressOpts]\n}\n\ninput WhiteBlackListInput {\n\twhiteList: WhiteBlackListArrInput\n\tblackList: WhiteBlackListArrInput\n}\n\ninput SnoozeInput {\n\tid: ID!\n\tuntil: Float!\n}\n\ninput DismissInput {\n\tid: ID!\n\tdismissedAt: Float!\n}\n\ninput AddMsgInput {\n\tfolderId: ID!\n\tabsFolderPath: String\n\tcontent: String\n\tmeta: String\n}\n\n\ninput SaveMessageDataInput {\n\tid: ID!\n\tcontent: String!\n\tmeta: String!\n}\n\ninput Grantee {\n\tid: ID\n\ttype: String\n\tname: String\n}\n\ninput Owner {\n\tby: String\n\t_content: String\n}\n\ninput uploadDocument {\n\tid: ID! #id\n}\n\ninput messagePartForDocument {\n\tmessageId: ID! #id\n\tattachmentPart: String! #part\n}\n\ninput SaveDocumentInput {\n\tid: ID #id\n\tfolderId: ID #l\n\tname: String #name\n\tversion: Float  #ver  # Note :same item may have different versions (i.e same names) will need to implement ListDocumentRevisionsRequest\n\tcontentType: String #ct\n\tupload: uploadDocument #upload with a id\n\tmessageData: [messagePartForDocument] #m\n \tdescriptionEnabled: Boolean  #descEnabled\n}\n\n##### SMIME Certificates type #####\n\ntype SMimePublicCert {\n\tstore: String!\n\tfield: String!\n\t_content: String\n}\n\ntype SMimePublicCerts {\n\temail: String\n\tcert: [SMimePublicCert]\n}\n\ntype SMimePublicCertsResponse {\n\tcerts: [SMimePublicCerts]\n}\n\ntype SMimeMessage {\n\tid: ID\n\tcontent: String\n}\n\ntype Attachment {\n\tid: ID\n\tcontent: String\n}\n\n##### End Of SMIME Certificates type #####\n\ntype ActionOpResponseData {\n\tid: ID!\n\top: String!\n}\n\ntype ActionOpResponse {\n\taction: ActionOpResponseData\n}\n\ntype RightsResponse {\n\taccess: [AccountACEInfo]\n}\n\ntype AccountACEInfo {\n\tzimbraId: ID\n\tgranteeType: GranteeType!\n\tright: String!\n\taddress: String\n\tkey: String\n\tpassword: String\n\tdeny: Boolean\n\tcheckGrantee: Boolean\n}\n\ntype Locale {\n\tid: ID\n\tname: String\n\tlocalName: String\n}\n\ntype GetTrustedDevicesResponse {\n\tnOtherDevices: Int\n\tthisDeviceTrusted: Boolean\n}\n\ntype AppSpecificPassword {\n\tappName: String\n\tcreated: Float\n\tlastUsed: Float\n}\n\ntype AppSpecificPasswords {\n\tpasswordData: [AppSpecificPassword]\n}\n\ntype MaxAppPasswords {\n\t_content: Int\n}\n\ntype AppSpecificPasswordsResponse {\n\tappSpecificPasswords: AppSpecificPasswords\n\tmaxAppPasswords: [MaxAppPasswords]\n}\n\ntype CreateAppSpecificPasswordResponse {\n\tpassword: String\n}\n\n\n# Zimbra GraphQL Queries\n# - [[SOAP API Reference]](https://files.zimbra.com/docs/soap_api/8.7.11/api-reference/index.html)\n# - [[SOAP Documentation]](https://github.com/Zimbra/zm-mailbox/blob/develop/store/docs/soap.txt)\n# - [[SOAP XML-to-JSON Documentation]](https://wiki.zimbra.com/wiki/Json_format_to_represent_soap)\ntype Query {\n\taccountInfo: AccountInfo\n\tautoComplete(\n\t\tname: String\n\t\ttype: GalSearchType\n\t\tneedExp: Boolean\n\t\tfolders: String\n\t\tincludeGal: Boolean\n\t): AutoCompleteResponse\n\tautoCompleteGAL(\n\t\tlimit: Int\n\t\tname: String!\n\t\ttype: GalSearchType\n\t\tneedExp: Boolean\n\t): AutoCompleteGALResponse\n\tclientInfo(domain: String!): ClientInfoType\n\tdownloadMessage(id: ID!, isSecure: Boolean): SMimeMessage\n\tdownloadAttachment(id: ID!, part: ID!): Attachment\n\tdiscoverRights: DiscoverRights\n\tfreeBusy(names: [String!]!, start: Float, end: Float): [FreeBusy]\n\tgetContact(\n\t\tid: ID\n\t\tids: [ID!]\n\t\tderefGroupMember: Boolean\n\t\tmemberOf: Boolean\n\t): [Contact]\n\tgetAppointments(\n\t\tcalExpandInstStart: Float!\n\t\tcalExpandInstEnd: Float!\n\t\tquery: String!\n\t\tlimit: Int!\n\t\toffset: Int!\n\t\ttypes: SearchType\n\t): SearchResponse\n\tgetAppointment(\n\t\tid: ID!\n\t): GetAppointmentResponse\n\tgetReminders(\n\t\tcalExpandInstStart: Float!\n\t\tcalExpandInstEnd: Float!\n\t\tquery: String!\n\t\tlimit: Int!\n\t\toffset: Int!\n\t\ttypes: SearchType\n\t): RemindersResponse\n\tgetTasks(\n\t\tquery: String!\n\t\tlimit: Int!\n\t\toffset: Int!\n\t\ttypes: SearchType\n\t): SearchResponse\n\tgetAppSpecificPasswords: AppSpecificPasswordsResponse\n\tgetAvailableLocales: [Locale]\n\tgetContactFrequency(\n\t\temail: String!\n\t\tby: String!\n\t\toffsetInMinutes: String\n\t\tspec: [ContactFrequencySpec!]\n\t): ContactFrequencyResponse\n\tgetConversation(\n\t\tid: ID!\n\t\theader: [MailItemHeaderInput]\n\t\thtml: Boolean\n\t\tmax: Int\n\t\tneedExp: Boolean\n\t\tfetch: String\n\t): Conversation\n\tgetFilterRules: [Filter]\n\tgetFolder(\n\t\tvisible: Boolean\n\t\tneedGranteeName: Boolean\n\t\tview: FolderView\n\t\tdepth: Int\n\t\ttraverseMountpoints: Boolean\n\t\tfolder: GetFolderFolderInput\n\t): Folder\n\tgetCustomMetadata(\n\t\tid: ID!\n\t\tsection: String\n\t): CustomMetadata\n\tgetMailboxMetadata(section: String): MailboxMetadata\n\tgetMessage(\n\t\tid: ID!\n\t\theader: [MailItemHeaderInput]\n\t\thtml: Boolean\n\t\tmax: Int\n\t\tneedExp: Boolean\n\t\tneuter: Boolean\n\t\tpart: ID\n\t\traw: Boolean\n\t\tread: Boolean\n\t\tridZ: String\n\t): MessageInfo\n\tgetMessagesMetadata(ids: [ID!]!): [MessageInfo]\n\tgetRights(input: GetRightsInput!): RightsResponse\n\tgetSMimePublicCerts(\n\t\tcontactAddr: String!\n\t\tstore: String!\n\t): SMimePublicCertsResponse\n\tgetScratchCodes(username: String!): ScratchCodes\n\tgetSearchFolder: Folder\n\tgetTrustedDevices: GetTrustedDevicesResponse\n\tgetWhiteBlackList: WhiteBlackList\n\tgetWorkingHours(names: [String!]!, start: Float, end: Float): [WorkingHours]\n\tnoop: Boolean\n\tgetPreferences: Preferences\n\tgetDataSources: DataSources!\n\tgetIdentities: Identities\n\tgetSignatures: Signatures\n\n\trecoverAccount(\n\t\top: RecoverAccountOp!\n\t\temail: String!\n\t\tchannel: SetRecoveryAccountChannel!\n\t): RecoverAccount\n\trelatedContacts(email: String!): [RelatedContact]\n\tshareInfo(\n\t\tinternal: Boolean\n\t\tincludeSelf: Boolean\n\t\tgrantee: Grantee\n\t\towner: Owner\n\t): [ShareInfo]\n\t# Perform a search for a variety types using a flexible query interface.\n\t# [[SOAP Search API Documentation]](https://files.zimbra.com/docs/soap_api/8.7.11/api-reference/zimbraMail/Search.html)\n\t# [[Query Tips]](https://wiki.zimbra.com/wiki/Zimbra_Web_Client_Search_Tips)\n\tsearch(\n\t\tcontact: String\n\t\tcursor: Cursor\n\t\tfetch: String\n\t\tfullConversation: Boolean\n\t\tlimit: Int\n\t\tneedExp: Boolean\n\t\tmemberOf: Boolean\n\t\toffset: Int\n\t\tquery: String\n\t\trecip: Int\n\t\tsortBy: SortBy\n\t\ttypes: SearchType\n\t\tresultMode: String\n\t): SearchResponse\n\n\tsearchGal(\n\t\tneedIsOwner: Boolean\n\t\tneedIsMember: NeedIsMemberType\n\t\ttype: GalSearchType\n\t\tname: String\n\t\toffset: Int\n\t\tlimit: Int\n\t\tlocale: String\n\t\tsortBy: String\n\t\tneedExp: Boolean\n\t): SearchResponse\n\n\ttaskFolders: [Folder]\n\n\tgetTag: [Tag]\n}\n\ntype Mutation {\n\taction(\n\t\ttype: ActionTypeName!\n\t\tid: ID\n\t\tids: [ID!]\n\t\top: String!\n\t\tcolor: Int\n\t\tconstraints: String\n\t\tflags: String\n\t\tfolderId: ID\n\t\trgb: String\n\t\ttagNames: String\n\t\tname: String\n\t): Boolean\n\tapplyFilterRules(ids: String!, filterRules: [FilterRuleInput]): [String]\n\ttestExternalAccount(\n\t\texternalAccount: ExternalAccountTestInput!\n\t): ExternalAccountTestResponse\n\taddExternalAccount(externalAccount: ExternalAccountAddInput!): ID\n\taddMessage(message: AddMsgInput!): MessageInfo\n\tcancelTask(inviteId: ID!): Boolean\n\tsaveDocument(document: SaveDocumentInput): Boolean\n\tchangeFolderColor(id: ID!, color: Int!): Boolean\n\tchangePassword(\n\t\tloginNewPassword: String!\n\t\tpassword: String!\n\t\tusername: String!\n\t): AuthResponse\n\tmodifyProfileImage(\n\t\tcontent: String\n\t\tcontentType: String\n\t): ProfileImageChangeResponse\n\tcheckCalendar(id: ID!, value: Boolean!): Boolean\n\tcontactAction(id: ID, ids: [ID!], folderId: ID, op: String!, tagNames: String): ActionOpResponse\n\tconversationAction(ids: [ID!]!, op: String!): Boolean\n\tcounterAppointment(\n\t\tcounterAppointmentInvite: CounterAppointmentInput!\n\t): Boolean\n\tcreateAppointment(\n\t\taccountName: String\n\t\tappointment: CalendarItemInput!\n\t): Boolean\n\tcreateAppointmentException(\n\t\taccountName: String\n\t\tappointment: CalendarItemInput!\n\t): Boolean\n\tcreateAppSpecificPassword(appName: String!): CreateAppSpecificPasswordResponse\n\tcreateCalendar(name: String!, color: Int!, url: String): Folder\n\tcreateContact(contact: CreateContactInput!): Contact\n\tcreateContactList(contact: CreateContactInput!): Contact\n\tmodifyContact(contact: ModifyContactInput!): Contact\n\tmodifyContactList(contact: ModifyContactInput!): Contact\n\tcreateFolder(\n\t\tcolor: Int\n\t\tfetchIfExists: Boolean\n\t\tflags: String\n\t\tname: String!\n\t\tparentFolderId: ID\n\t\turl: String\n\t\tview: FolderView\n\t): Folder\n\tcreateIdentity(name: String!, attrs: IdentityAttrsInput): Identities\n\tcreateMountpoint(link: NewMountpointSpec!): Boolean\n\tcreateSharedCalendar(link: NewMountpointSpec!): Boolean\n\tcreateSearchFolder(\n\t\tname: String!\n\t\tparentFolderId: ID\n\t\tquery: String!\n\t\ttypes: FolderView\n\t): Folder\n\tcreateSignature(signature: SignatureInput!): SignatureResponse\n\tcreateTask(task: CalendarItemInput!): Boolean\n\tdeclineCounterAppointment(\n\t\tcounterAppointmentInvite: CounterAppointmentInput!\n\t): Boolean\n\tdeleteAppointment(appointment: DeleteAppointmentInput!): Boolean\n\tdeleteIdentity(id: ID!, name: String): Boolean\n\tdeleteExternalAccount(id: ID!): Boolean\n\tdeleteSignature(signature: NameIdInput!): Boolean\n\tgenerateScratchCodes(username: String!): ScratchCodes\n\tgrantRights(input: GrantRightsInput!): RightsResponse\n\tfolderAction(action: FolderActionInput!): Boolean\n\tforwardAppointmentInvite(\n\t\tappointmentInvite: ForwardAppointmentInviteInput!\n\t): Boolean\n\tforwardAppointment(appointmentInvite: ForwardAppointmentInput!): Boolean\n\titemAction(id: ID, ids: [ID], folderId: ID, op: String!): Boolean\n\timportExternalAccount(externalAccount: ExternalAccountImportInput!): Boolean\n\tlogout: Boolean\n\tlogin(\n\t\tusername: String!\n\t\tpassword: String\n\t\trecoveryCode: String\n\t\ttokenType: String\n\t\tpersistAuthTokenCookie: Boolean\n\t\ttwoFactorCode: String\n\t\tdeviceTrusted: Boolean\n\t\tcsrfTokenSecured: Boolean!\n\t): AuthResponse\n\tenableTwoFactorAuth(\n\t\toptions: EnableTwoFactorAuthInput!\n\t): EnableTwoFactorAuthResponse\n\tdisableTwoFactorAuth: Boolean\n\tmessageAction(ids: [ID!]!, op: String!): Boolean\n\tmodifyExternalAccount(\n\t\tid: ID!\n\t\ttype: AccountType\n\t\tattrs: ExternalAccountModifyAttrsInput!\n\t): Boolean\n\tmodifyAppointment(\n\t\taccountName: String\n\t\tappointment: CalendarItemInput!\n\t): ModifyAppointmentResponse\n\tmodifyIdentity(id: ID!, attrs: IdentityAttrsInput): Boolean\n\tmodifyPrefs(prefs: PreferencesInput!): Boolean\n\tmodifyProps(props: [PropertiesInput!]): Boolean\n\tmodifyZimletPrefs(\n\t\tzimlets: [ZimletPreferenceInput!]\n\t): ModifyZimletPrefsResponse\n\tmodifyFilterRules(filters: [FilterInput!]): Boolean\n\tmodifySignature(signature: SignatureInput!): Boolean\n\tmodifySearchFolder(search: SearchFolderInput!): Boolean\n\tmodifyTask(task: CalendarItemInput!): Boolean\n\tmodifyWhiteBlackList(whiteBlackList: WhiteBlackListInput!): Boolean\n\tmoveTask(inviteId: ID!, destFolderId: ID!): String\n\tprefEnableOutOfOfficeAlertOnLogin(value: Boolean!): Boolean\n\tprefEnableOutOfOfficeReply(value: Boolean!): Boolean\n\tprefOutOfOfficeFromDate(value: String!): String\n\tprefOutOfOfficeReply(value: String!): String\n\tprefOutOfOfficeUntilDate(value: String!): String\n\trecoverAccount(\n\t\top: RecoverAccountOp!\n\t\temail: String!\n\t\tchannel: SetRecoveryAccountChannel!\n\t): RecoverAccount\n\tresetPassword(password: String!): Boolean\n\trevokeAppSpecificPassword(appName: String!): Boolean\n\trevokeOtherTrustedDevices: Boolean\n\trevokeRights(input: RevokeRightsInput!): RightsResponse\n\trevokeTrustedDevice: Boolean\n\tsaveDraft(message: SendMessageInput!): SaveDraftResponse\n\tsendMessage(message: SendMessageInput!): SendMessageResponse\n\tsendDeliveryReport(messageId: ID!): Boolean\n\tsendInviteReply(inviteReply: InviteReplyInput!): InviteReplyResponse\n\tsendShareNotification(shareNotification: ShareNotificationInput!): Boolean\n\tsetCustomMetadata(customMetaData: CustomMetadataInput!): Boolean\n\tsetMailboxMetadata(\n\t\tsection: String\n\t\tattrs: MailboxMetadataSectionAttrsInput!\n\t): Boolean\n\tsnoozeCalendarItem(appointment: [SnoozeInput], task: SnoozeInput): Boolean\n\tdismissCalendarItem(appointment: [DismissInput], task: DismissInput): Boolean\n\tuploadMessage(value: String!): String\n\tsetRecoveryAccount(\n\t\tchannel: SetRecoveryAccountChannel!\n\t\top: SetRecoveryAccountOp!\n\t\trecoveryAccount: String\n\t\trecoveryAccountVerificationCode: String\n\t): Boolean\n\tcreateTag(tag: CreateTagInput): Tag\n\ttagAction(action: FolderActionInput): Boolean\n}\n\nschema {\n\tquery: Query\n\tmutation: Mutation\n}\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n\tfragment session on Session {\n\t\tid\n\t}\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var SESSION_GQL_FRAGMENT = gql(_templateObject());
var SessionHandler = function SessionHandler(options) {
  var _this = this;

  _classCallCheck(this, SessionHandler);

  this.cacheKeyForSession = 'Session';

  this.readSessionId = function () {
    var sessionIdFragment = _this.cache.readFragment({
      id: _this.cacheKeyForSession,
      fragment: SESSION_GQL_FRAGMENT
    });

    return get(sessionIdFragment, 'id') || '1';
  };

  this.writeSessionId = function (sessionId) {
    _this.cache.writeFragment({
      id: _this.cacheKeyForSession,
      fragment: SESSION_GQL_FRAGMENT,
      data: {
        id: sessionId,
        __typename: 'Session'
      }
    });
  };

  this.cache = options.cache;
};

function createZimbraSchema(options) {
  var cache = options.cache,
      getApolloClient = options.getApolloClient,
      clientOptions = _objectWithoutProperties(options, ["cache", "getApolloClient"]);

  var sessionHandler = cache ? new SessionHandler({
    cache: cache
  }) : undefined;
  var client = new ZimbraBatchClient(_objectSpread2({}, clientOptions, {
    sessionHandler: sessionHandler
  }));
  var localStoreClient = options.localStoreClient;
  var executableSchema = makeExecutableSchema({
    typeDefs: doc,
    resolvers: {
      Query: {
        accountInfo: client.accountInfo,
        autoComplete: function autoComplete(_, variables) {
          return client.autoComplete(variables);
        },
        autoCompleteGAL: function autoCompleteGAL(_, variables) {
          return client.autoCompleteGAL(variables);
        },
        discoverRights: client.discoverRights,
        downloadAttachment: function downloadAttachment(_, variables) {
          return client.downloadAttachment(variables);
        },
        downloadMessage: function downloadMessage(_, variables) {
          var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          var local = context.local;

          if (local) {
            return localStoreClient.downloadMessage(variables);
          }

          return client.downloadMessage(variables);
        },
        freeBusy: function freeBusy(_, variables) {
          return client.freeBusy(variables);
        },
        getContact: function getContact(_, variables) {
          return client.getContact(variables);
        },
        clientInfo: function clientInfo(_, variables) {
          return client.clientInfo(variables);
        },
        getContactFrequency: function getContactFrequency(_, variables) {
          return client.getContactFrequency(variables);
        },
        getConversation: function getConversation(_, variables) {
          return client.getConversation(variables);
        },
        getCustomMetadata: function getCustomMetadata(_, variables) {
          return client.getCustomMetadata(variables);
        },
        getFilterRules: client.getFilterRules,
        getFolder: function getFolder(_, variables) {
          var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          var local = context.local;

          if (local) {
            return localStoreClient.getFolder(variables);
          }

          return client.getFolder(variables);
        },
        getAppointment: function getAppointment(_, variables) {
          return client.getAppointment(variables);
        },
        getAppointments: function getAppointments(_, variables) {
          return client.search(variables);
        },
        getReminders: function getReminders(_, variables) {
          return client.search(variables);
        },
        getTasks: function getTasks(_, variables) {
          return client.getTasks(variables);
        },
        getAvailableLocales: function getAvailableLocales(_) {
          return client.getAvailableLocales();
        },
        getMailboxMetadata: function getMailboxMetadata(_, variables) {
          return client.getMailboxMetadata(variables);
        },
        getMessage: function getMessage(_, variables) {
          var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          var local = context.local;

          if (local) {
            return localStoreClient.getMessage(variables);
          }

          return client.getMessage(variables);
        },
        getMessagesMetadata: function getMessagesMetadata(_, variables) {
          var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          var local = context.local;

          if (local) {
            return localStoreClient.getMessagesMetadata(variables);
          }

          return client.getMessagesMetadata(variables);
        },
        getRights: function getRights(_, variables) {
          return client.getRights(variables);
        },
        getScratchCodes: client.getScratchCodes,
        getSearchFolder: client.getSearchFolder,
        getSMimePublicCerts: function getSMimePublicCerts(_, variables) {
          return client.getSMimePublicCerts(variables);
        },
        getTrustedDevices: client.getTrustedDevices,
        getWorkingHours: function getWorkingHours(_, variables) {
          return client.getWorkingHours(variables);
        },
        getPreferences: client.getPreferences,
        getDataSources: client.getDataSources,
        getIdentities: client.getIdentities,
        getSignatures: client.getSignatures,
        noop: client.noop,
        recoverAccount: function recoverAccount(_, variables) {
          return client.recoverAccount(variables);
        },
        relatedContacts: function relatedContacts(_, variables) {
          return client.relatedContacts(variables);
        },
        search: function search(_, variables) {
          var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          var local = context.local;

          if (local) {
            return localStoreClient.search(variables);
          }

          return client.search(variables);
        },
        searchGal: function searchGal(_, variables) {
          return client.searchGal(variables);
        },
        shareInfo: function shareInfo(_, variables) {
          return client.shareInfo(variables);
        },
        taskFolders: client.taskFolders,
        getWhiteBlackList: client.getWhiteBlackList,
        getAppSpecificPasswords: client.getAppSpecificPasswords,
        getTag: client.getTag
      },
      MailItem: {
        __resolveType: function __resolveType(obj) {
          return obj.conversationId ? 'MessageInfo' : 'Conversation';
        }
      },
      Mutation: {
        action: function action(_, _ref) {
          var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

          var type = _ref.type,
              rest = _objectWithoutProperties(_ref, ["type"]);

          var local = context.local;
          return local ? localStoreClient.action(type, rest) : client.action(type, rest);
        },
        addMessage: function addMessage(_, variables) {
          var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          var local = context.local;

          if (local) {
            return localStoreClient.addMessage(variables);
          }

          return client.addMessage(variables);
        },
        applyFilterRules: function applyFilterRules(_, variables) {
          return client.applyFilterRules(variables);
        },
        cancelTask: function cancelTask(_, variables) {
          return client.cancelTask(variables);
        },
        itemAction: function itemAction(_, variables) {
          return client.itemAction(variables);
        },
        login: function login(_, variables) {
          return client.login(variables);
        },
        logout: client.logout,
        disableTwoFactorAuth: client.disableTwoFactorAuth,
        enableTwoFactorAuth: function enableTwoFactorAuth(_, _ref2) {
          var options = _ref2.options;
          return client.enableTwoFactorAuth(options);
        },
        messageAction: function messageAction(_, variables) {
          return client.messageAction(variables);
        },
        changePassword: function changePassword(_, variables) {
          return client.changePassword(variables);
        },
        modifyProfileImage: function modifyProfileImage(_, variables) {
          return client.modifyProfileImage(variables);
        },
        contactAction: function contactAction(_, variables) {
          return client.contactAction(variables);
        },
        createAppSpecificPassword: function createAppSpecificPassword(_, _ref3) {
          var appName = _ref3.appName;
          return client.createAppSpecificPassword(appName);
        },
        conversationAction: function conversationAction(_, variables) {
          return client.conversationAction(variables);
        },
        createFolder: function createFolder(_, variables, context) {
          var local = context.local;

          if (local) {
            return localStoreClient.createFolder(variables);
          }

          return client.createFolder(variables);
        },
        createSearchFolder: function createSearchFolder(_, variables) {
          return client.createSearchFolder(variables);
        },
        createContact: function createContact(_, _ref4) {
          var contact = _ref4.contact;
          return client.createContact(contact);
        },
        createContactList: function createContactList(_, _ref5) {
          var contact = _ref5.contact;
          return client.createContact(contact);
        },
        modifyContact: function modifyContact(_, _ref6) {
          var contact = _ref6.contact;
          return client.modifyContact(contact);
        },
        modifyContactList: function modifyContactList(_, _ref7) {
          var contact = _ref7.contact;
          return client.modifyContact(contact);
        },
        createAppointment: function createAppointment(_, _ref8) {
          var accountName = _ref8.accountName,
              appointment = _ref8.appointment;
          return client.createAppointment(accountName, appointment);
        },
        snoozeCalendarItem: function snoozeCalendarItem(_, _ref9) {
          var appointment = _ref9.appointment,
              task = _ref9.task;
          return client.snoozeCalendarItem(appointment, task);
        },
        dismissCalendarItem: function dismissCalendarItem(_, _ref10) {
          var appointment = _ref10.appointment,
              task = _ref10.task;
          return client.dismissCalendarItem(appointment, task);
        },
        createAppointmentException: function createAppointmentException(_, _ref11) {
          var accountName = _ref11.accountName,
              appointment = _ref11.appointment;
          return client.createAppointmentException(accountName, appointment);
        },
        modifyAppointment: function modifyAppointment(_, _ref12) {
          var accountName = _ref12.accountName,
              appointment = _ref12.appointment;
          return client.modifyAppointment(accountName, appointment);
        },
        createMountpoint: function createMountpoint(_, variables) {
          return client.createMountpoint(variables);
        },
        deleteAppointment: function deleteAppointment(_, _ref13) {
          var appointment = _ref13.appointment;
          return client.deleteAppointment(appointment);
        },
        checkCalendar: function checkCalendar(_, variables) {
          return client.checkCalendar(variables);
        },
        counterAppointment: function counterAppointment(_, _ref14) {
          var counterAppointmentInvite = _ref14.counterAppointmentInvite;
          return client.counterAppointment(counterAppointmentInvite);
        },
        createCalendar: function createCalendar(_, _ref15) {
          var name = _ref15.name,
              color = _ref15.color,
              url = _ref15.url;
          return client.createFolder({
            name: name,
            color: color,
            url: url,
            view: 'appointment',
            flags: '#'
          });
        },
        createSharedCalendar: function createSharedCalendar(_, _ref16) {
          var link = _ref16.link;
          return client.createMountpoint({
            link: _objectSpread2({}, link, {
              parentFolderId: 1,
              view: 'appointment',
              flags: '#'
            })
          });
        },
        saveDocument: function saveDocument(_, document) {
          return client.saveDocument(document);
        },
        changeFolderColor: function changeFolderColor(_, variables) {
          return client.changeFolderColor(variables);
        },
        declineCounterAppointment: function declineCounterAppointment(_, _ref17) {
          var counterAppointmentInvite = _ref17.counterAppointmentInvite;
          return client.declineCounterAppointment(counterAppointmentInvite);
        },
        folderAction: function folderAction(_, _ref18) {
          var action = _ref18.action;
          return client.folderAction(action);
        },
        forwardAppointment: function forwardAppointment(_, _ref19) {
          var appointmentInvite = _ref19.appointmentInvite;
          return client.forwardAppointment(appointmentInvite);
        },
        forwardAppointmentInvite: function forwardAppointmentInvite(_, _ref20) {
          var appointmentInvite = _ref20.appointmentInvite;
          return client.forwardAppointmentInvite(appointmentInvite);
        },
        generateScratchCodes: client.generateScratchCodes,
        grantRights: function grantRights(_, variables) {
          return client.grantRights(variables.input);
        },
        sendShareNotification: function sendShareNotification(_, _ref21) {
          var shareNotification = _ref21.shareNotification;
          return client.sendShareNotification(shareNotification);
        },
        testExternalAccount: function testExternalAccount(_, _ref22) {
          var externalAccount = _ref22.externalAccount;
          return client.testExternalAccount(externalAccount);
        },
        addExternalAccount: function addExternalAccount(_, _ref23) {
          var externalAccount = _ref23.externalAccount;
          return client.addExternalAccount(externalAccount);
        },
        modifyExternalAccount: function modifyExternalAccount(_, variables) {
          return client.modifyExternalAccount(variables);
        },
        deleteExternalAccount: function deleteExternalAccount(_, variables) {
          return client.deleteExternalAccount(variables);
        },
        importExternalAccount: function importExternalAccount(_, _ref24) {
          var externalAccount = _ref24.externalAccount;
          return client.importExternalAccount(externalAccount);
        },
        prefEnableOutOfOfficeAlertOnLogin: function prefEnableOutOfOfficeAlertOnLogin(_, _ref25) {
          var value = _ref25.value;
          return client.modifyPrefs({
            zimbraPrefOutOfOfficeStatusAlertOnLogin: value
          }).then(Boolean);
        },
        prefEnableOutOfOfficeReply: function prefEnableOutOfOfficeReply(_, _ref26) {
          var value = _ref26.value;
          return client.modifyPrefs({
            zimbraPrefOutOfOfficeReplyEnabled: value
          }).then(Boolean);
        },
        prefOutOfOfficeFromDate: function prefOutOfOfficeFromDate(_, _ref27) {
          var value = _ref27.value;
          return client.modifyPrefs({
            zimbraPrefOutOfOfficeFromDate: value
          }).then(function () {
            return value;
          });
        },
        prefOutOfOfficeUntilDate: function prefOutOfOfficeUntilDate(_, _ref28) {
          var value = _ref28.value;
          return client.modifyPrefs({
            zimbraPrefOutOfOfficeUntilDate: value
          }).then(function () {
            return value;
          });
        },
        prefOutOfOfficeReply: function prefOutOfOfficeReply(_, _ref29) {
          var value = _ref29.value;
          return client.modifyPrefs({
            zimbraPrefOutOfOfficeReply: value
          }).then(function () {
            return value;
          });
        },
        createIdentity: function createIdentity(_, variables) {
          return client.createIdentity(variables);
        },
        modifyIdentity: function modifyIdentity(_, variables) {
          return client.modifyIdentity(variables).then(Boolean);
        },
        deleteIdentity: function deleteIdentity(_, variables) {
          return client.deleteIdentity(variables).then(Boolean);
        },
        modifyPrefs: function modifyPrefs(_, _ref30) {
          var prefs = _ref30.prefs;
          return client.modifyPrefs(prefs);
        },
        modifyProps: function modifyProps(_, _ref31) {
          var props = _ref31.props;
          return client.modifyProps(props);
        },
        modifyZimletPrefs: function modifyZimletPrefs(_, _ref32) {
          var zimlets = _ref32.zimlets;
          return client.modifyZimletPrefs(zimlets);
        },
        modifyFilterRules: function modifyFilterRules(_, _ref33) {
          var filters = _ref33.filters;
          return client.modifyFilterRules(filters);
        },
        createSignature: function createSignature(_, variables) {
          return client.createSignature(variables);
        },
        modifySignature: function modifySignature(_, variables) {
          return client.modifySignature(variables);
        },
        modifySearchFolder: function modifySearchFolder(_, variables) {
          return client.modifySearchFolder(variables);
        },
        deleteSignature: function deleteSignature(_, variables) {
          return client.deleteSignature(variables);
        },
        saveDraft: function saveDraft(_, variables) {
          return client.saveDraft(variables);
        },
        sendMessage: function sendMessage(_, variables) {
          return client.sendMessage(variables);
        },
        sendDeliveryReport: function sendDeliveryReport(_, _ref34) {
          var messageId = _ref34.messageId;
          return client.sendDeliveryReport(messageId);
        },
        uploadMessage: function uploadMessage(_, _ref35) {
          var value = _ref35.value;
          return client.uploadMessage(value);
        },
        createTask: function createTask(_, _ref36) {
          var task = _ref36.task;
          return client.createTask(task);
        },
        modifyTask: function modifyTask(_, _ref37) {
          var task = _ref37.task;
          return client.modifyTask(task);
        },
        sendInviteReply: function sendInviteReply(_, _ref38) {
          var inviteReply = _ref38.inviteReply;
          return client.sendInviteReply(inviteReply);
        },
        recoverAccount: function recoverAccount(_, variables) {
          return client.recoverAccount(variables);
        },
        resetPassword: function resetPassword(_, variables) {
          return client.resetPassword(variables);
        },
        revokeAppSpecificPassword: function revokeAppSpecificPassword(_, _ref39) {
          var appName = _ref39.appName;
          return client.revokeAppSpecificPassword(appName);
        },
        revokeOtherTrustedDevices: client.revokeOtherTrustedDevices,
        revokeRights: function revokeRights(_, variables) {
          return client.revokeRights(variables.input);
        },
        revokeTrustedDevice: client.revokeTrustedDevice,
        setCustomMetadata: function setCustomMetadata(_, customMetadata) {
          return client.setCustomMetadata(customMetadata);
        },
        setMailboxMetadata: function setMailboxMetadata(_, variables) {
          return client.jsonRequest({
            name: 'SetMailboxMetadata',
            body: {
              meta: {
                section: variables.section,
                _attrs: mapValues(variables.attrs, coerceBooleanToString)
              }
            }
          }).then(Boolean);
        },
        setRecoveryAccount: function setRecoveryAccount(_, variables) {
          return client.setRecoveryAccount(variables);
        },
        modifyWhiteBlackList: function modifyWhiteBlackList(_, _ref40) {
          var whiteBlackList = _ref40.whiteBlackList;
          return client.modifyWhiteBlackList(whiteBlackList);
        },
        createTag: function createTag(_, _ref41) {
          var tag = _ref41.tag;
          return client.createTag(tag);
        },
        tagAction: function tagAction(_, _ref42) {
          var action = _ref42.action;
          return client.action(ActionType.tag, action);
        }
      }
    }
  });
  return {
    client: client,
    schema: executableSchema
  };
}

var LocalBatchLink =
/*#__PURE__*/
function (_ApolloLink) {
  _inherits(LocalBatchLink, _ApolloLink);

  function LocalBatchLink(options) {
    var _this;

    _classCallCheck(this, LocalBatchLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LocalBatchLink).call(this));
    _this.schema = options.schema;
    var notifier = new emitter();
    _this.on = notifier.on;
    _this.off = notifier.off;

    var batchHandler = function batchHandler(operations) {
      return new Observable(function (observer) {
        notifier.emit('req', operations);
        var emittedResponse = false;
        Promise.all(operations.map(function (operation) {
          var query = print(operation.query);
          var operationName = operation.operationName,
              _operation$variables = operation.variables,
              variables = _operation$variables === void 0 ? {} : _operation$variables;
          return graphql(_this.schema, query, null, operation.getContext() || options.context || {}, variables, operationName);
        })).then(function (results) {
          (emittedResponse = true) && notifier.emit('res', results);
          observer.next(results);
          observer.complete();
          return results;
        })["catch"](function (err) {
          emittedResponse || notifier.emit('res', err);
          observer.error(err);
        });
      });
    };

    _this.batcher = new BatchLink({
      batchInterval: options.batchInterval,
      batchHandler: batchHandler
    });
    return _this;
  }

  _createClass(LocalBatchLink, [{
    key: "request",
    value: function request(operation) {
      return this.batcher.request(operation);
    }
  }]);

  return LocalBatchLink;
}(ApolloLink);

var ZimbraErrorLink =
/*#__PURE__*/
function (_ErrorLink) {
  _inherits(ZimbraErrorLink, _ErrorLink);

  function ZimbraErrorLink() {
    var _this;

    _classCallCheck(this, ZimbraErrorLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ZimbraErrorLink).call(this, function (_ref) {
      var graphQLErrors = _ref.graphQLErrors,
          networkError = _ref.networkError;
      graphQLErrors && graphQLErrors.map(function (_ref2) {
        var message = _ref2.message,
            originalError = _ref2.originalError,
            rest = _objectWithoutProperties(_ref2, ["message", "originalError"]);

        var errorCode = get(originalError, 'faults.0.Detail.Error.Code', '');

        _this.executeHandlers(_objectSpread2({
          errorCode: errorCode,
          message: message,
          originalError: originalError
        }, rest));
      });
      networkError && _this.executeHandlers({
        message: "[Network error]: ".concat(networkError)
      });
    }));
    _this.handlers = [];

    _this.executeHandlers = function (data) {
      _this.handlers.map(function (handler) {
        handler(data);
      });
    };

    _this.registerHandler = function (handler) {
      _this.handlers.push(handler);
    };

    _this.unRegisterAllHandlers = function () {
      _this.handlers = [];
    };

    _this.unRegisterHandler = function (handler) {
      var index = _this.handlers.findIndex(handler);

      index !== -1 && _this.handlers.splice(index, 1);
    };

    return _this;
  }

  return ZimbraErrorLink;
}(ErrorLink);

var dataIdFromPath = function dataIdFromPath(result, path) {
  if (result.__typename) {
    var id = get(result, path);
    return id ? "".concat(result.__typename, ":").concat(id) : defaultDataIdFromObject(result);
  }
};

var dataIdFromObject = function dataIdFromObject(object) {
  switch (object.__typename) {
    case 'CalendarItemHitInfo':
      if (object.instances) {
        return "".concat(defaultDataIdFromObject(object), ":").concat(object.instances.length);
      }

      return "".concat(defaultDataIdFromObject(object));

    case 'MailboxMetadata':
      return dataIdFromPath(object, 'meta.0.section');

    case 'Folder':
      if (object.id === '1') {
        return "".concat(object.__typename, ":").concat(object.id, ":").concat(object.uuid);
      }

      return defaultDataIdFromObject(object);

    case 'AutoCompleteMatch':
      return "".concat(defaultDataIdFromObject(object), ":").concat(object.email);

    case 'ContactListMember':
      return "".concat(object.type, ":").concat(object.value);

    default:
      return defaultDataIdFromObject(object);
  }
};

function createFragmentMatcher() {
  var fragmentMatcherFactory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object;
  return new IntrospectionFragmentMatcher(fragmentMatcherFactory({
    introspectionQueryResultData: {
      __schema: {
        types: [{
          kind: 'INTERFACE',
          name: 'MailItem',
          possibleTypes: [{
            name: 'Conversation'
          }, {
            name: 'MessageInfo'
          }, {
            name: 'MsgWithGroupInfo'
          }]
        }]
      }
    }
  }));
}

var ZimbraInMemoryCache =
/*#__PURE__*/
function (_InMemoryCache) {
  _inherits(ZimbraInMemoryCache, _InMemoryCache);

  function ZimbraInMemoryCache() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ZimbraInMemoryCache);

    if (!config.fragmentMatcher || typeof config.fragmentMatcher === 'function') {
      config.fragmentMatcher = createFragmentMatcher(config.fragmentMatcher);
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(ZimbraInMemoryCache).call(this, _objectSpread2({
      dataIdFromObject: dataIdFromObject
    }, config)));
  }

  return ZimbraInMemoryCache;
}(InMemoryCache);

var SyncOfflineOperations = function SyncOfflineOperations(_ref) {
  var _this = this;

  var apolloClient = _ref.apolloClient,
      storage = _ref.storage,
      _ref$storeKey = _ref.storeKey,
      storeKey = _ref$storeKey === void 0 ? '@offlineQueueKey' : _ref$storeKey;

  _classCallCheck(this, SyncOfflineOperations);

  this.addOfflineData = function () {
    var queue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if (queue && queue.length > 0) _this.storage.setItem(_this.storeKey, JSON.stringify(queue));
  };

  this.clearOfflineData = function () {
    _this.offlineData = [];
    return Promise.resolve(_this.storage.removeItem(_this.storeKey));
  };

  this.getOfflineData = function () {
    return Promise.resolve(_this.storage.getItem(_this.storeKey));
  };

  this.hasOfflineData = function () {
    return !!(_this.offlineData && _this.offlineData.length > 0);
  };

  this.init = function () {
    return _this.getOfflineData().then(function (stored) {
      return _this.offlineData = stored && JSON.parse(stored) || [];
    });
  };

  this.sync = function () {
    if (!_this.hasOfflineData()) return;
    var uncommitted = [];
    return Promise.all(_this.offlineData.map(function (item) {
      return _this.apolloClient['mutation' in item ? 'mutate' : 'query'](item)["catch"](function () {
        uncommitted.push(item);
      });
    }))["catch"](function (e) {
      return console.warn('SyncOfflineOperations::sync ERR:', e);
    }).then(_this.clearOfflineData).then(function () {
      _this.addOfflineData(uncommitted);
    });
  };

  if (!apolloClient) throw new Error('Apollo Client instance is required when syncing data, please assign value to it');
  if (!storage) throw new Error('Storage can be window.localStorage or AsyncStorage but was not set');
  this.apolloClient = apolloClient;
  this.storage = storage;
  this.storeKey = storeKey;
  this.offlineData = [];
};

var DedupedByQueueError =
/*#__PURE__*/
function (_Error) {
  _inherits(DedupedByQueueError, _Error);

  function DedupedByQueueError() {
    var _this;

    _classCallCheck(this, DedupedByQueueError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DedupedByQueueError).call(this, 'Operation was deduplicated by offline-queue-link.'));
    Object.defineProperty(_assertThisInitialized(_this), 'name', {
      value: 'DedupedByQueueError'
    });
    return _this;
  }

  return DedupedByQueueError;
}(_wrapNativeSuper(Error));

function hasSensitiveVariables(operation) {
  return !!get(operation, 'variables.password');
}
function isMutationOperation(_ref) {
  var query = _ref.query;
  return query && query.definitions && query.definitions.filter(function (e) {
    return e.operation === 'mutation';
  }).length > 0;
}
function deriveOfflineQueue(operationQueue) {
  return operationQueue.map(function (_ref2) {
    var _ref3;

    var _ref2$operation = _ref2.operation,
        query = _ref2$operation.query,
        variables = _ref2$operation.variables;
    return _ref3 = {}, _defineProperty(_ref3, isMutationOperation({
      query: query
    }) ? 'mutation' : 'query', query), _defineProperty(_ref3, "variables", variables), _ref3;
  });
}

var OfflineQueueLink =
/*#__PURE__*/
function (_ApolloLink) {
  _inherits(OfflineQueueLink, _ApolloLink);

  function OfflineQueueLink(_ref) {
    var _this;

    var storage = _ref.storage,
        _ref$storeKey = _ref.storeKey,
        storeKey = _ref$storeKey === void 0 ? '@offlineQueueKey' : _ref$storeKey,
        _ref$isOpen = _ref.isOpen,
        isOpen = _ref$isOpen === void 0 ? true : _ref$isOpen;

    _classCallCheck(this, OfflineQueueLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OfflineQueueLink).call(this));

    _this.cancelNamedQueue = function (offlineQueueName) {
      var entry = _this.namedQueues[offlineQueueName];

      if (entry) {
        _this.dequeue(entry);

        if (entry.observer && entry.observer.error) {
          entry.observer.error(new DedupedByQueueError());
        }

        _this.namedQueues[offlineQueueName] = undefined;
      }
    };

    _this.close = function () {
      _this.isOpen = false;
    };

    _this.dequeue = function (entry) {
      var index = _this.operationQueue.indexOf(entry);

      if (index !== -1) {
        _this.operationQueue = [].concat(_toConsumableArray(_this.operationQueue.slice(0, index)), _toConsumableArray(_this.operationQueue.slice(index + 1)));
      }

      _this.persist();
    };

    _this.enqueue = function (entry) {
      _this.operationQueue.push(entry);

      _this.persist();
    };

    _this.getSize = function () {
      return Promise.resolve(_this.storage.getItem(_this.storeKey)).then(function (d) {
        return (d || '').length;
      });
    };

    _this.open = function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          apolloClient = _ref2.apolloClient;

      if (!apolloClient) return;
      _this.isOpen = true;
      return _this.retry();
    };

    _this.persist = function () {
      return Promise.resolve(_this.storage.setItem(_this.storeKey, JSON.stringify(deriveOfflineQueue(_this.operationQueue))));
    };

    _this.purge = function () {
      return Promise.resolve(_this.storage.removeItem(_this.storeKey));
    };

    _this.retry = function () {
      return new Promise(function (resolve) {
        var outstandingReqs = _this.operationQueue.length;

        if (!outstandingReqs) {
          return resolve();
        }

        var done = function done() {
          if (--outstandingReqs === 0) {
            resolve();
          }
        };

        _this.operationQueue.forEach(function (entry) {
          var operation = entry.operation,
              forward = entry.forward,
              observer = entry.observer;
          forward(operation).subscribe({
            next: function next(value) {
              if (observer.next) {
                observer.next(value);
              }
            },
            error: function error(err) {
              _this.dequeue(entry);

              if (observer.error) {
                observer.error(err);
              }

              done();
            },
            complete: function complete() {
              _this.dequeue(entry);

              if (observer.complete) {
                observer.complete();
              }

              done();
            }
          });
        });
      });
    };

    _this.sync = function (_ref3) {
      var apolloClient = _ref3.apolloClient;
      if (!apolloClient) return;
      var syncOfflineOperations = new SyncOfflineOperations({
        apolloClient: apolloClient,
        storage: _this.storage,
        storeKey: _this.storeKey
      });
      return syncOfflineOperations.init().then(function (data) {
        if (data && data.length) {
          return syncOfflineOperations.sync();
        }
      });
    };

    if (!storage) throw new Error('Storage can be window.localStorage or AsyncStorage but was not set');
    _this.storage = storage;
    _this.storeKey = storeKey;
    _this.namedQueues = {};
    _this.operationQueue = [];
    _this.isOpen = isOpen;
    return _this;
  }

  _createClass(OfflineQueueLink, [{
    key: "request",
    value: function request(operation, forward) {
      var _this2 = this;

      var _operation$getContext = operation.getContext(),
          skipQueue = _operation$getContext.skipQueue,
          cancelQueues = _operation$getContext.cancelQueues,
          offlineQueueName = _operation$getContext.offlineQueueName,
          local = _operation$getContext.local;

      var isForwarding = this.isOpen || local || skipQueue || hasSensitiveVariables(operation);

      if (isForwarding && forward) {
        return forward(operation);
      }

      return new Observable(function (observer) {
        var entry = {
          operation: operation,
          forward: forward,
          observer: observer
        };

        if (offlineQueueName) {
          _this2.cancelNamedQueue(offlineQueueName);

          if (!~castArray(cancelQueues).indexOf(offlineQueueName)) {
            _this2.namedQueues[offlineQueueName] = entry;
          }
        }

        if (cancelQueues) {
          castArray(cancelQueues).forEach(_this2.cancelNamedQueue);
        }

        _this2.enqueue(entry);

        return function () {
          return _this2.dequeue(entry);
        };
      });
    }
  }]);

  return OfflineQueueLink;
}(ApolloLink);

var MailFolderView;

(function (MailFolderView) {
  MailFolderView["conversation"] = "conversation";
  MailFolderView["message"] = "message";
})(MailFolderView || (MailFolderView = {}));

var MessageFlags;

(function (MessageFlags) {
  MessageFlags["unread"] = "u";
  MessageFlags["flagged"] = "f";
  MessageFlags["hasAttachment"] = "a";
  MessageFlags["replied"] = "r";
  MessageFlags["sentByMe"] = "s";
  MessageFlags["forwarded"] = "w";
  MessageFlags["calendarInvite"] = "v";
  MessageFlags["draft"] = "d";
  MessageFlags["imapDeleted"] = "x";
  MessageFlags["notificationSent"] = "n";
  MessageFlags["urgent"] = "!";
  MessageFlags["lowPriority"] = "?";
  MessageFlags["priority"] = "+";
})(MessageFlags || (MessageFlags = {}));

var ActionOps;

(function (ActionOps) {
  ActionOps["update"] = "update";
  ActionOps["delete"] = "delete";
  ActionOps["read"] = "read";
  ActionOps["unread"] = "!read";
  ActionOps["flag"] = "flag";
  ActionOps["unflag"] = "!flag";
  ActionOps["tag"] = "tag";
  ActionOps["untag"] = "!tag";
  ActionOps["move"] = "move";
  ActionOps["spam"] = "spam";
  ActionOps["unspam"] = "!spam";
  ActionOps["trash"] = "trash";
  ActionOps["copy"] = "copy";
})(ActionOps || (ActionOps = {}));

var _MessageActionOps;

(function (_MessageActionOps) {
  _MessageActionOps["update"] = "update";
})(_MessageActionOps || (_MessageActionOps = {}));

var _ConversationActionOps;

(function (_ConversationActionOps) {
  _ConversationActionOps["priority"] = "priority";
})(_ConversationActionOps || (_ConversationActionOps = {}));

var types = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get MailFolderView () { return MailFolderView; },
  get MessageFlags () { return MessageFlags; },
  get ActionOps () { return ActionOps; },
  get _MessageActionOps () { return _MessageActionOps; },
  get _ConversationActionOps () { return _ConversationActionOps; },
  get ActionType () { return ActionType; },
  get ActionResultType () { return ActionResultType; },
  get AccountType () { return AccountType; },
  get ActionTypeName () { return ActionTypeName; },
  get AddressType () { return AddressType; },
  get AlarmAction () { return AlarmAction; },
  get AlarmRelatedTo () { return AlarmRelatedTo; },
  get AutoCompleteMatchType () { return AutoCompleteMatchType; },
  get CalendarItemClass () { return CalendarItemClass; },
  get CalendarItemRecurrenceFrequency () { return CalendarItemRecurrenceFrequency; },
  get ConnectionType () { return ConnectionType; },
  get ContactType () { return ContactType; },
  get FilterMatchCondition () { return FilterMatchCondition; },
  get FolderView () { return FolderView; },
  get FreeBusyStatus () { return FreeBusyStatus; },
  get GalSearchType () { return GalSearchType; },
  get GranteeType () { return GranteeType; },
  get Importance () { return Importance; },
  get InviteCompletionStatus () { return InviteCompletionStatus; },
  get InviteReplyType () { return InviteReplyType; },
  get InviteReplyVerb () { return InviteReplyVerb; },
  get InviteType () { return InviteType; },
  get LicenseStatus () { return LicenseStatus; },
  get NeedIsMemberType () { return NeedIsMemberType; },
  get ParticipationRole () { return ParticipationRole; },
  get ParticipationStatus () { return ParticipationStatus; },
  get PasswordRecoveryAddressStatus () { return PasswordRecoveryAddressStatus; },
  get PrefCalendarInitialView () { return PrefCalendarInitialView; },
  get PrefClientType () { return PrefClientType; },
  get PrefDelegatedSendSaveTarget () { return PrefDelegatedSendSaveTarget; },
  get PrefMailSelectAfterDelete () { return PrefMailSelectAfterDelete; },
  get PrefMailSendReadReceipts () { return PrefMailSendReadReceipts; },
  get ReadingPaneLocation () { return ReadingPaneLocation; },
  get RecoverAccountOp () { return RecoverAccountOp; },
  get ResetPasswordStatus () { return ResetPasswordStatus; },
  get SearchType () { return SearchType; },
  get SetRecoveryAccountChannel () { return SetRecoveryAccountChannel; },
  get SetRecoveryAccountOp () { return SetRecoveryAccountOp; },
  get ShareInputAction () { return ShareInputAction; },
  get SortBy () { return SortBy; },
  get Weekday () { return Weekday; },
  get ZimletPresence () { return ZimletPresence; }
});

var entities = {
  Contact: Contact,
  Conversation: Conversation,
  FolderEntity: Folder,
  Mailbox: Mailbox,
  MessageInfo: MessageInfo,
  Tag: Tag
};

export { LocalBatchLink, OfflineQueueLink, SyncOfflineOperations, ZimbraBatchClient, ZimbraErrorLink, ZimbraInMemoryCache, batchJsonRequest, createZimbraSchema, entities, jsonRequest, normalize, doc as schema, types };
//# sourceMappingURL=zm-api-js-client.esm.js.map
