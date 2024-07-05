/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "docs";

export interface GreetingData {
  greeting: string;
}

export interface HelloRequest {
  name: string;
}

export interface HelloResponse {
  status: number;
  code: number;
  message: string;
  data: GreetingData | undefined;
}

function createBaseGreetingData(): GreetingData {
  return { greeting: "" };
}

export const GreetingData = {
  encode(message: GreetingData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.greeting !== "") {
      writer.uint32(10).string(message.greeting);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GreetingData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGreetingData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.greeting = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GreetingData {
    return { greeting: isSet(object.greeting) ? globalThis.String(object.greeting) : "" };
  },

  toJSON(message: GreetingData): unknown {
    const obj: any = {};
    if (message.greeting !== "") {
      obj.greeting = message.greeting;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GreetingData>, I>>(base?: I): GreetingData {
    return GreetingData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GreetingData>, I>>(object: I): GreetingData {
    const message = createBaseGreetingData();
    message.greeting = object.greeting ?? "";
    return message;
  },
};

function createBaseHelloRequest(): HelloRequest {
  return { name: "" };
}

export const HelloRequest = {
  encode(message: HelloRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HelloRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHelloRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): HelloRequest {
    return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
  },

  toJSON(message: HelloRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HelloRequest>, I>>(base?: I): HelloRequest {
    return HelloRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HelloRequest>, I>>(object: I): HelloRequest {
    const message = createBaseHelloRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseHelloResponse(): HelloResponse {
  return { status: 0, code: 0, message: "", data: undefined };
}

export const HelloResponse = {
  encode(message: HelloResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== 0) {
      writer.uint32(8).int32(message.status);
    }
    if (message.code !== 0) {
      writer.uint32(16).int32(message.code);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    if (message.data !== undefined) {
      GreetingData.encode(message.data, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HelloResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHelloResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.status = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.code = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.message = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.data = GreetingData.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): HelloResponse {
    return {
      status: isSet(object.status) ? globalThis.Number(object.status) : 0,
      code: isSet(object.code) ? globalThis.Number(object.code) : 0,
      message: isSet(object.message) ? globalThis.String(object.message) : "",
      data: isSet(object.data) ? GreetingData.fromJSON(object.data) : undefined,
    };
  },

  toJSON(message: HelloResponse): unknown {
    const obj: any = {};
    if (message.status !== 0) {
      obj.status = Math.round(message.status);
    }
    if (message.code !== 0) {
      obj.code = Math.round(message.code);
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    if (message.data !== undefined) {
      obj.data = GreetingData.toJSON(message.data);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HelloResponse>, I>>(base?: I): HelloResponse {
    return HelloResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HelloResponse>, I>>(object: I): HelloResponse {
    const message = createBaseHelloResponse();
    message.status = object.status ?? 0;
    message.code = object.code ?? 0;
    message.message = object.message ?? "";
    message.data = (object.data !== undefined && object.data !== null)
      ? GreetingData.fromPartial(object.data)
      : undefined;
    return message;
  },
};

export interface BlinkGreetingService {
  hello(request: HelloRequest, metadata?: Metadata): Promise<HelloResponse>;
}

export const BlinkGreetingServiceServiceName = "docs.BlinkGreetingService";
export class BlinkGreetingServiceClientImpl implements BlinkGreetingService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || BlinkGreetingServiceServiceName;
    this.rpc = rpc;
    this.hello = this.hello.bind(this);
  }
  hello(request: HelloRequest): Promise<HelloResponse> {
    const data = HelloRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "hello", data);
    return promise.then((data) => HelloResponse.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
